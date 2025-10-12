import { ClassMethodTest, ClassMethodTester }
    from '../util/test-class-method.js';
import Url from '../src/url-parser.js';

const testUrls = [
    "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180",
    "https://query.frag/#?",
    "https://empty.parts/?#",
    "https://test.com/?q=test&id=21afea8219bc#privacy",
    "https://test.com?q=test&id=21afea8219bc#privacy" ,
    "https://empty.value/?q=test&dm=",
    "-"
];

const getOriginTest = new ClassMethodTest(Url, "getOrigin", [], "Url.getOrigin");
getOriginTest.addTestCases([
    {
        input: { url: testUrls[0] },
        keys: [ "url" ],
        expectedOutput: "https://tagassistant.google.com"
    },
    {
        input: { url: testUrls[1] },
        keys: [ "url" ],
        expectedOutput: "https://query.frag"
    },
    {
        input: { url: testUrls[2] },
        keys: [ "url" ],
        expectedOutput: "https://empty.parts"
    },
    {
        input: { url: testUrls[3] },
        keys: [ "url" ],
        expectedOutput: "https://test.com"
    },
    {
        input: { url: testUrls[4] },
        keys: [ "url" ],
        expectedOutput: "https://test.com"
    },
    {
        input: { url: testUrls[5] },
        keys: [ "url" ],
        expectedOutput: "https://empty.value"
    },
    {
        input: { url: testUrls[6] },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getPathTest = new ClassMethodTest(Url, "getPath", [], "Url.getPath");
getPathTest.addTestCases([
    {
        input: { url: testUrls[0] },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: testUrls[1] },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: testUrls[2] },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: testUrls[3] },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: testUrls[4] },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: testUrls[5] },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: testUrls[6] },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getParametersTest = new ClassMethodTest(Url, "getParameters", [], "Url.getParameters");
getParametersTest.addTestCases([
    {
        input: { url: testUrls[0] },
        keys: [ "url" ],
        expectedOutput: "?hl=en&utm_source=gtm"
    },
    {
        input: { url: testUrls[1] },
        keys: [ "url" ],
        expectedOutput: ""
    },
    {
        input: { url: testUrls[2] },
        keys: [ "url" ],
        expectedOutput: "?"
    },
    {
        input: { url: testUrls[3] },
        keys: [ "url" ],
        expectedOutput: "?q=test&id=21afea8219bc"
    },
    {
        input: { url: testUrls[4] },
        keys: [ "url" ],
        expectedOutput: "?q=test&id=21afea8219bc"
    },
    {
        input: { url: testUrls[5] },
        keys: [ "url" ],
        expectedOutput: "?q=test&dm="
    },
    {
        input: { url: testUrls[6] },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getFragmentTest = new ClassMethodTest(Url, "getFragment", [], "Url.getFragment");
getFragmentTest.addTestCases([
    {
        input: { url: testUrls[0] },
        keys: [ "url" ],
        expectedOutput: "#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180"
    },
    {
        input: { url: testUrls[1] },
        keys: [ "url" ],
        expectedOutput: "#?"
    },
    {
        input: { url: testUrls[2] },
        keys: [ "url" ],
        expectedOutput: "#"
    },
    {
        input: { url: testUrls[3] },
        keys: [ "url" ],
        expectedOutput: "#privacy"
    },
    {
        input: { url: testUrls[4] },
        keys: [ "url" ],
        expectedOutput: "#privacy"
    },
    {
        input: { url: testUrls[5] },
        keys: [ "url" ],
        expectedOutput: ""
    },
    {
        input: { url: testUrls[6] },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getFullUrlTest = new ClassMethodTest(Url, "getFullUrl", [], "Url.getFullUrl");
getFullUrlTest.addTestCases([
    {
        input: { url: testUrls[0] },
        keys: [ "url" ],
        expectedOutput: "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180"
    },
    {
        input: { url: testUrls[1] },
        keys: [ "url" ],
        expectedOutput: "https://query.frag/#?"
    },
    {
        input: { url: testUrls[2] },
        keys: [ "url" ],
        expectedOutput: "https://empty.parts/?#"
    },
    {
        input: { url: testUrls[3] },
        keys: [ "url" ],
        expectedOutput: "https://test.com/?q=test&id=21afea8219bc#privacy"
    },
    {
        input: { url: testUrls[4] },
        keys: [ "url" ],
        expectedOutput: "https://test.com/?q=test&id=21afea8219bc#privacy"
    },
    {
        input: { url: testUrls[5] },
        keys: [ "url" ],
        expectedOutput: "https://empty.value/?q=test&dm="
    },
    {
        input: { url: testUrls[6] },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const tester = new ClassMethodTester();
tester.addTestSet(getOriginTest);
tester.addTestSet(getPathTest);
tester.addTestSet(getParametersTest);
tester.addTestSet(getFragmentTest);
tester.addTestSet(getFullUrlTest);

const option = (process.argv[2] || '').toLowerCase();
tester.runTests(option != '--silent');
