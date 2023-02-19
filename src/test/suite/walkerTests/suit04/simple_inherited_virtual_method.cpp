class TestBaseClass
{
public:
    virtual int add(int val1, int val2)
    {
        return val1 + val2;
    }
};

class TestClass : public TestBaseClass
{
public:
    int add(int val1, int val2) override
    {
        return TestBaseClass::add(val1, val2);
    }
};

int main(int argc, char *argv[])
{
    TestClass test;
    return test.add(1, 2);
}
