#include <simple_c_style_func.h>

int sub(unsigned int val1, unsigned int val2);

int sub(unsigned int val1, unsigned int val2)
{
    return val1 - val2;
}

int main(int argc, char* argv[])
{
    return mult(2, 2) + foo::add(4, 4) + sub(8, 10);
}
