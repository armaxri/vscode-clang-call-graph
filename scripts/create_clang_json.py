#!/usr/bin/python3

"""This script creates a json file containing the clang AST of a given file."""

import argparse
import pathlib
import subprocess

def main(args):
    """Main function."""

    cpp_path = pathlib.Path(args.file).absolute()
    cpp_dir_path = cpp_path.parent
    cpp_json_path = cpp_dir_path / (cpp_path.stem + ".json")

    subprocess.run(["clang++", f"-I{cpp_dir_path}", "-c", cpp_path, "-Xclang", "-ast-dump=json", "-fsyntax-only"], stdout=cpp_json_path.open("w"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-f", "--file", help="The file to be parsed.")
    args = parser.parse_args()

    main(args)
