#include <simple_c_style_func.h>

int sub(int val1, int val2);

int sub(int val1, int val2)
{
    return val1 - val2;
}

int main(int argc, char* argv[])
{
    return mult(2, 2) + foo::add(4, 4) + sub(8, 10) + divide(4, 2);
}
