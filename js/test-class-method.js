import { color } from './color.js';

export class ClassMethodTester {
    constructor() {
        this.tests = [];
        this.failedTests = 0;
        this.passedTests = 0;
    }

    addTestSet(testCases) {
        this.tests.push(testCases);
    }

    updateTestCounter(failed, passed) {
        this.failedTests += failed;
        this.passedTests += passed;
    }

    runTests() {
        this.tests.forEach(e => {
            const [failed, passed] = e.runTests();
            this.updateTestCounter(failed, passed);
        })
        color.log('default', 'Summary:');
        if (this.failedTests === 0) {
            color.log('green', '\x1b[32m' + ' test passed ('
                + this.passedTests + ' test'
                + (this.passedTests===1?'':'s') + ').');
            console.log();
            return;
        }
        color.log('brightRed', '\x1b[91m' + ' test failed ('
            + this.failedTests + ' error'
            + (this.failedTests===1?'':'s') + ' out of '
            + (this.failedTests + this.passedTests) + ' test'
            + ((this.failedTests + this.passedTests)===1?'':'s') + ').');
        console.log();
    }
}

export class ClassMethodTest {
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

    addTestCases(tests) {
        tests.forEach(e => this.tests.push(e));
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
        process.stdout.write('Running test for ');
        color.log('brightYellow', this.name);
        console.log('...');
        let errors = 0;
        this.tests.forEach(e => {
            const obj = new this.testClass(e.input);
            const result = obj[this.method](...this.methodParams);
            const test = result == e.expectedOutput;
            color.log('default', '  → ');
            color.log('brightYellow', 'Case');
            console.log(':\n    → `' + this.describeCase(e) + '    ');
            color.log('default', '    ')
            color.log('yellow', 'Expected output')
            color.log('default', ':\n    → `' + e.expectedOutput + '`\n    ')
            
            color.log('brightCyan', 'Actual output')
            if (test == true) {
                color.log('default', ':\n    → `' + obj[this.method]() + '`\n        (');
                color.log('green', 'Ok');
            } else {
                color.log('default', ':\n    → `');
                color.log('strikethrough', obj[this.method]());
                color.log('default', '`\n        (');
                errors++;
                color.log('brightRed', 'Fail');
            }
            console.log(')');
        })
        process.stdout.write("  → Test result: ");
        if (errors === 0) {
            color.log('green', 'passed ('
                + this.tests.length + ' test'
                + (this.tests.length===1?'':'s') + ').');
        } else {
            color.log('brightRed', 'failed ('
                + errors + ' error' + (errors===1?'':'s') + ' out of '
                + this.tests.length + ' test'
                + (this.tests.length===1?'':'s') + ').');
        }
        console.log();
        return [errors, this.tests.length - errors];
    }
}
