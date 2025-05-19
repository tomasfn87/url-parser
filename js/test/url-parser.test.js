import { ClassMethodTest, ClassMethodTester }
    from '../util/test-class-method.js';
import Url from '../src/url-parser.js';

const getDomainTest = new ClassMethodTest(Url, "getDomain", [], "Url.getDomain");
getDomainTest.addTestCases([
    {
        input: { url: "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180" },
        keys: [ "url" ],
        expectedOutput: "https://tagassistant.google.com"
    },
    {
        input: { url: "https://query.frag/#?" },
        keys: [ "url" ],
        expectedOutput: "https://query.frag"
    },
    {
        input: { url: "https://empty.parts/?#" },
        keys: [ "url" ],
        expectedOutput: "https://empty.parts"
    },
    {
        input: { url: "https://test.com/?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "https://test.com"
    },
    {
        input: { url: "https://test.com?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "https://test.com"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getPathTest = new ClassMethodTest(Url, "getPath", [], "Url.getPath");
getPathTest.addTestCases([
    {
        input: { url: "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180" },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: "https://query.frag/#?" },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: "https://empty.parts/?#" },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: "https://test.com/?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: "https://test.com?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "/"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getParametersTest = new ClassMethodTest(Url, "getParameters", [], "Url.getParameters");
getParametersTest.addTestCases([
    {
        input: { url: "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180" },
        keys: [ "url" ],
        expectedOutput: "?hl=en&utm_source=gtm"
    },
    {
        input: { url: "https://query.frag/#?" },
        keys: [ "url" ],
        expectedOutput: ""
    },
    {
        input: { url: "https://empty.parts/?#" },
        keys: [ "url" ],
        expectedOutput: "?"
    },
    {
        input: { url: "https://test.com/?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "?q=test&id=21afea8219bc"
    },
    {
        input: { url: "https://test.com?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "?q=test&id=21afea8219bc"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getFragmentTest = new ClassMethodTest(Url, "getFragment", [], "Url.getFragment");
getFragmentTest.addTestCases([
    {
        input: { url: "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180" },
        keys: [ "url" ],
        expectedOutput: "#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180"
    },
    {
        input: { url: "https://query.frag/#?" },
        keys: [ "url" ],
        expectedOutput: "#?"
    },
    {
        input: { url: "https://empty.parts/?#" },
        keys: [ "url" ],
        expectedOutput: "#"
    },
    {
        input: { url: "https://test.com/?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "#privacy"
    },
    {
        input: { url: "https://test.com?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "#privacy"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const getFullUrlTest = new ClassMethodTest(Url, "getFullUrl", [], "Url.getFullUrl");
getFullUrlTest.addTestCases([
    {
        input: { url: "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180" },
        keys: [ "url" ],
        expectedOutput: "https://tagassistant.google.com/?hl=en&utm_source=gtm#/?source=TAG_MANAGER&id=GTM-MXNVD4PJ&gtm_auth=H0X5tN2DEEpfJ0eha8q7Ig&gtm_preview=env-5&cb=5607611040920180"
    },
    {
        input: { url: "https://query.frag/#?" },
        keys: [ "url" ],
        expectedOutput: "https://query.frag/#?"
    },
    {
        input: { url: "https://empty.parts/?#" },
        keys: [ "url" ],
        expectedOutput: "https://empty.parts/?#"
    },
    {
        input: { url: "https://test.com/?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "https://test.com/?q=test&id=21afea8219bc#privacy"
    },
    {
        input: { url: "https://test.com?q=test&id=21afea8219bc#privacy" },
        keys: [ "url" ],
        expectedOutput: "https://test.com/?q=test&id=21afea8219bc#privacy"
    },
    {
        input: { url: "-" },
        keys: [ "url" ],
        expectedOutput: ""
    }
]);

const tester = new ClassMethodTester();
tester.addTestSet(getDomainTest);
tester.addTestSet(getPathTest);
tester.addTestSet(getParametersTest);
tester.addTestSet(getFragmentTest);
tester.addTestSet(getFullUrlTest);

const option = (process.argv[2] || '').toLowerCase();
tester.runTests(option != '--silent');
