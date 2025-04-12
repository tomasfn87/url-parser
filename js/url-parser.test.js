import TestClassMethod from './test-class-method.js';
import Url from './url-parser.js';

const getDomainTest = new TestClassMethod(Url, "getDomain", [], "Url.getDomain");
getDomainTest.addTestCases([
    {
        input: {
            url: "https://test.com/?q=test&id=21afea8219bc#privacy"
        },
        keys: [ "url" ],
        expectedOutput: "https://test.com"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);
getDomainTest.runTests();

const getPathTest = new TestClassMethod(Url, "getPath", [], "Url.getPath");
getPathTest.addTestCases([
    {
        input: {
            url: "https://test.com/?q=test&id=21afea8219bc#privacy"
        },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);
getPathTest.runTests();

const getParametersTest = new TestClassMethod(Url, "getParameters", [], "Url.getParameters");
getParametersTest.addTestCases([
    {
        input: {
            url: "https://test.com/?q=test&id=21afea8219bc#privacy"
        },
        keys: [ "url" ],
        expectedOutput: "?q=test&id=21afea8219bc"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);
getParametersTest.runTests();

const getFragmentTest = new TestClassMethod(Url, "getFragment", [], "Url.getFragment");
getFragmentTest.addTestCases([
    {
        input: {
            url: "https://test.com/?q=test&id=21afea8219bc#privacy"
        },
        keys: [ "url" ],
        expectedOutput: "#privacy"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);
getFragmentTest.runTests();
