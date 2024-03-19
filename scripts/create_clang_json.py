#!/usr/bin/python3

"""This script creates a json file containing the clang AST of a given file or updates all files in the test directory."""

import argparse
import pathlib
import subprocess

def execute_process(command):
    """Execute a command in the shell."""
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, _ = process.communicate()
    return out

def get_project_test_dir():
    """Get the project test directory."""
    return pathlib.Path(__file__).parent.parent.joinpath("src").joinpath("test")

def remove_project_test_dir_prefix(path):
    """Remove the project directory prefix from a path."""
    project_dir = get_project_test_dir()
    return path.replace(str(project_dir), "")

def get_cpp_files_int_test_dir():
    """Get all the cpp files in the test directory."""
    project_dir = get_project_test_dir()
    return [f for f in project_dir.glob("**/*.cpp")]

def split_json_line(line):
    """Split a json line into its components."""
    string_components = line.split('": "')
    if string_components[1][-1] == ',':
        right_string = string_components[1][:-2]
        end_char = ','
    else:
        right_string = string_components[1][:-1]
        end_char = ''

    return string_components[0], right_string, end_char

def find_lines_with_file_string(json_lines):
    """Find the lines containing the file string and generate an absolute path of the string and remove the project directory from the path."""
    new_lines = []
    for line in json_lines:
        if '  "file": "' in line:
            left_string, file_string, end_char = split_json_line(line)
            file_path = str(pathlib.Path(file_string).absolute())
            file_path = remove_project_test_dir_prefix(file_path)
            new_lines.append(left_string + '": "' + file_path + '"' + end_char)
        else:
            new_lines.append(line)

    return new_lines

def adjust_id_lines(json_lines):
    """Adjust the ids of the json file."""
    new_lines = []
    known_ids = {}
    current_id = 0
    for line in json_lines:
        if '  "id": "' in line:
            left_string, old_id, end_char = split_json_line(line)
            current_id += 1
            known_ids[old_id] = current_id
            new_lines.append(left_string + '": "0x' + format(current_id, f'0{16}x') + '"' + end_char)
        elif '  "previousDecl": "' in line:
            left_string, old_id, end_char = split_json_line(line)
            new_lines.append(left_string + '": "0x' + format(known_ids[old_id], f'0{16}x') + '"' + end_char)
        elif '  "referencedMemberDecl": "' in line:
            left_string, old_id, end_char = split_json_line(line)
            new_lines.append(left_string + '": "0x' + format(known_ids[old_id], f'0{16}x') + '"' + end_char)
        else:
            new_lines.append(line)

    return new_lines

def generate_json_file(cpp_file, adjust_ids):
    """Generate a json file for a given cpp file."""
    cpp_path = pathlib.Path(cpp_file).absolute()
    cpp_dir_path = cpp_path.parent
    cpp_json_path = cpp_dir_path / (cpp_path.stem + ".json")

    process_output = execute_process(["clang++", f"-I{cpp_dir_path}", "-c", cpp_path, "-Xclang", "-ast-dump=json", "-fsyntax-only"])
    adjusted_output = process_output.decode("utf-8").split("\n")
    adjusted_output = find_lines_with_file_string(adjusted_output)

    if adjust_ids:
        adjusted_output = adjust_id_lines(adjusted_output)

    with cpp_json_path.open("w") as target_file:
        target_file.write("\n".join(adjusted_output))

def main(args):
    """Main function."""

    target_files = []

    if args.file:
        target_files.append(pathlib.Path(args.file).absolute())

    if args.update:
        target_files.extend(get_cpp_files_int_test_dir())

    for file in target_files:
        generate_json_file(file, args.adjust_ids)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-f", "--file", help="The file to be parsed.")
    parser.add_argument("-u", "--update", help="Update all files in the test directory.", action="store_true")
    parser.add_argument("-a", "--adjust_ids", help="Adjust the ids of the json files.", action="store_true")
    args = parser.parse_args()

    main(args)
