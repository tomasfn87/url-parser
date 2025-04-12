export default class TestClassMethod {
    constructor(testClass, method, methodParams, name) {
        if (typeof testClass !== 'function') {
            throw new Error("Class expected in 'testClass'.");
        }
        if (typeof global[method] === 'function') {
            throw new Error(`Function ${method} passed to 'method' was not found.`);
        }
        if (!Array.isArray(methodParams)) {
            throw new Error(`Array expected in 'methodParams.`);
        }
        if (typeof name !== 'string' || !name.length) {
            throw new Error("Non-empty string expected in 'name'.");
        }
        this.testClass = testClass;
        this.method = method;
        this.methodParams = methodParams;
        this.name = name;
        this.tests = [];
    }

    addTestCases(list) {
        list.forEach(e => {
            this.tests.push(e)
        })
    }

    describeCase(c) {
        let description = '';
        c.keys.forEach((e, i) => {
            description += c.input[e];
            if (i != (c.keys.length-1)) {
                description += "; "
            }
        })
        return description;
    }
    
    runTests() {
        process.stdout.write('* Running test for ');
        console.log('\x1b[93m' + this.name + '\x1b[0m...\n');
        let errors = 0;
        this.tests.forEach((e, i) => {
            const obj = new this.testClass(e.input);
            const result = obj[this.method](...this.methodParams);
            const test = result == e.expectedOutput;
            process.stdout.write(
                '\x1b[93m' + 'Case\x1b[0m:\n → '
                + this.describeCase(e)
                + '\n\x1b[33m' + 'Expected output' + '\x1b[0m:\n → '
                + e.expectedOutput
                + '\n\x1b[96m' + 'Actual output' + '\x1b[0m:\n → '
                + obj[this.method]() + '\n → [');
            if (test == true)
                console.log('\x1b[32m' + 'Ok' + '\x1b[0m]');
            else {
                errors++;
                console.log('\x1b[91m' + 'Fail' + '\x1b[0m]');
            }
            i != (this.tests.length - 1) && console.log()
        })
        console.log();
        if (errors === 0) {
            console.log('\x1b[32m' + 'Test passed ('
            + this.tests.length + ' test'
            + (this.tests.length===1?'':'s') + ').\x1b[0m');
            return
        }
        console.log('\x1b[91m' + 'Test failed ('
            + errors + ' error' + (errors===1?'':'s') + ' out of '
            + this.tests.length + ' test'
            + (this.tests.length===1?'':'s') + ').\x1b[0m')
    }
}
