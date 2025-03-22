/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    testEnvironment: "node",
    setupFilesAfterEnv: ["./src/tests/setupTests.ts"],
    transform: {
        "^.+.tsx?$": ["ts-jest", {}]
    }
}
