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


def replace_clang_installation_path(path):
    """Replace the clang installation path with the clang command."""
    string_components = path.split("/usr/")
    if len(string_components) < 2:
        return path
    return path.replace(string_components[0], "/clang++")


def get_cpp_files_int_test_dir():
    """Get all the cpp files in the test directory."""
    project_dir = get_project_test_dir()
    return [f for f in project_dir.glob("**/*.cpp")]


def split_json_line(line):
    """Split a json line into its components."""
    string_components = line.split('": "')
    if string_components[1][-1] == ",":
        right_string = string_components[1][:-2]
        end_char = ","
    else:
        right_string = string_components[1][:-1]
        end_char = ""

    return string_components[0], right_string, end_char


def find_lines_with_file_string(json_lines):
    """Find the lines containing the file string and generate an absolute path of the string and remove the project directory from the path."""
    new_lines = []
    for line in json_lines:
        if '  "file": "' in line:
            left_string, file_string, end_char = split_json_line(line)
            file_path = str(pathlib.Path(file_string).absolute())
            file_path = remove_project_test_dir_prefix(file_path)
            file_path = replace_clang_installation_path(file_path)
            new_lines.append(left_string + '": "' + file_path + '"' + end_char)
        else:
            new_lines.append(line)

    return new_lines


def adjust_id_lines(json_lines):
    """Adjust the ids of the json file."""
    new_lines = []
    known_ids = {}

    def get_known_id(old_id):
        if old_id not in known_ids.keys():
            known_ids[old_id] = known_ids.__len__() + 1
        return known_ids[old_id]

    for line in json_lines:
        if '  "id": "' in line:
            left_string, old_id, end_char = split_json_line(line)
            new_lines.append(
                left_string
                + '": "0x'
                + format(get_known_id(old_id), f"0{16}x")
                + '"'
                + end_char
            )
        elif '  "previousDecl": "' in line:
            left_string, old_id, end_char = split_json_line(line)
            new_lines.append(
                left_string
                + '": "0x'
                + format(get_known_id(old_id), f"0{16}x")
                + '"'
                + end_char
            )
        elif '  "referencedMemberDecl": "' in line:
            left_string, old_id, end_char = split_json_line(line)
            new_lines.append(
                left_string
                + '": "0x'
                + format(get_known_id(old_id), f"0{16}x")
                + '"'
                + end_char
            )
        else:
            new_lines.append(line)

    return new_lines


def adjust_underscore_ast_name(json_lines):
    """Remove the arbitrary number of underscores at the beginning of the ast names."""
    new_lines = []
    for line in json_lines:
        if '  "mangledName": "' in line:
            left_string, ast_name, end_char = split_json_line(line)
            new_ast_name = ast_name.lstrip("_")
            new_lines.append(left_string + '": "' + new_ast_name + '"' + end_char)
        else:
            new_lines.append(line)

    return new_lines


def generate_json_file(cpp_path, adjust_ids, remove_underscore_ast_name):
    """Generate a json file for a given cpp file."""
    cpp_dir_path = cpp_path.parent
    cpp_json_path = cpp_dir_path / (cpp_path.stem + ".json")

    process_output = execute_process(
        [
            "clang++",
            f"-I{cpp_dir_path}",
            "-c",
            cpp_path,
            "-std=c++20",
            "-Xclang",
            "-ast-dump=json",
            "-fsyntax-only",
        ]
    )
    adjusted_output = process_output.decode("utf-8").split("\n")
    adjusted_output = find_lines_with_file_string(adjusted_output)

    if adjust_ids:
        adjusted_output = adjust_id_lines(adjusted_output)

    if remove_underscore_ast_name:
        adjusted_output = adjust_underscore_ast_name(adjusted_output)

    with cpp_json_path.open("w") as target_file:
        target_file.write("\n".join(adjusted_output))


def generate_ast_file(cpp_path):
    """Generate an AST file for a given cpp file."""
    cpp_dir_path = cpp_path.parent
    cpp_ast_path = cpp_dir_path / (cpp_path.stem + ".ast")

    process_output = execute_process(
        [
            "clang++",
            f"-I{cpp_dir_path}",
            "-c",
            cpp_path,
            "-std=c++20",
            "-Xclang",
            "-ast-dump",
            "-fsyntax-only",
        ]
    )

    with cpp_ast_path.open("w") as target_file:
        target_file.write(process_output.decode("utf-8"))


def main(args):
    """Main function."""

    target_files = []

    if args.file:
        target_files.append(pathlib.Path(args.file).absolute())

    if args.update:
        target_files.extend(get_cpp_files_int_test_dir())

    for file in target_files:
        cpp_path = pathlib.Path(file).absolute()
        generate_json_file(cpp_path, args.adjust_ids, args.remove_underscore_ast_name)
        generate_ast_file(cpp_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-f", "--file", help="The file to be parsed.")
    parser.add_argument(
        "-u",
        "--update",
        help="Update all files in the test directory.",
        action="store_true",
    )
    parser.add_argument(
        "-a",
        "--adjust_ids",
        help="Adjust the ids of the json files.",
        action="store_true",
    )
    parser.add_argument(
        "-r",
        "--remove_underscore_ast_name",
        help="Remove the arbitrary number of underscores at the beginning of the ast names.",
        action="store_true",
    )
    args = parser.parse_args()

    main(args)
