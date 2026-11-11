# Test Automation Standards & Agent Configuration

This directory contains comprehensive test automation standards and configuration for AI agents (Planner, Generator, Healer) used in this project's Playwright test automation.

## 📚 Documentation Files

### Core Standards
- **[TEST-STANDARDS.md](TEST-STANDARDS.md)** (24.25 KB)  
  Complete reference guide for all test automation standards in this project
  - Page Object Model (POM) patterns and naming conventions
  - Fixture architecture and usage
  - Test data management (credentials and domain data)
  - Test file structure and conventions
  - Agent-specific standards for Planner, Generator, and Healer
  - Common workflows and best practices
  - Validation checklist
  - **11 comprehensive sections with examples**

### Quick Reference
- **[STANDARDS-QUICK-REFERENCE.md](STANDARDS-QUICK-REFERENCE.md)** (7.45 KB)  
  Quick lookup guide for developers and AI agents
  - Quick checklist for standards compliance
  - File structure reference
  - Naming conventions table
  - Common patterns with code examples
  - Red flags and how to fix them
  - Where to find help
  - Git commit template

### Implementation Guides
- **[AGENT-ENHANCEMENTS.md](AGENT-ENHANCEMENTS.md)** (11.25 KB)  
  Detailed explanation of improvements made to each agent
  - Planner agent enhancements
  - Generator agent enhancements
  - Healer agent enhancements
  - Integration between agents
  - Validation and compliance
  - Training and adoption guide

- **[AGENT-UPDATES-SUMMARY.md](AGENT-UPDATES-SUMMARY.md)** (7.46 KB)  
  Overview of all changes made
  - Files created and updated
  - Key standards enforced
  - Reference implementation examples
  - Next steps for adoption

## 🤖 Agent Configuration Files

### Playwright Test Planner
- **[agents/playwright-test-planner.agent.md](agents/playwright-test-planner.agent.md)**  
  Agent configuration for comprehensive test planning
  - Explores application UI and workflows
  - Creates detailed test scenarios
  - Outputs plans with seed files and POM documentation
  - References testdata files

### Playwright Test Generator
- **[agents/playwright-test-generator.agent.md](agents/playwright-test-generator.agent.md)**  
  Agent configuration for automated test generation
  - CRITICAL REQUIREMENTS section (imports, fixtures, data)
  - Generates tests from test plans
  - Follows POM and fixture patterns
  - Supports data-driven testing patterns
  - Comprehensive examples provided

### Playwright Test Healer
- **[agents/playwright-test-healer.agent.md](agents/playwright-test-healer.agent.md)**  
  Agent configuration for test debugging and fixing
  - Debugging and diagnosing test failures
  - POM-first approach for fixes
  - Four-scenario root cause analysis
  - Knows when to fix POM vs test vs data
  - Never introduces raw selectors in tests

## 🎯 How to Use This Repository

### For New Test Development
1. **Start with Planner Agent**
   - Provide feature description and URL
   - Agent explores UI and creates comprehensive test plan
   - Plan includes seed files and POM classes needed

2. **Use Generator Agent**
   - Provide the test plan from step 1
   - Agent generates ready-to-run test files
   - Tests follow all standards automatically

3. **Iterate with Healer Agent** (if tests fail)
   - Agent debugs and fixes failing tests
   - Maintains architectural standards
   - Fixes POM issues (not tests)

### For Understanding Standards
1. **Quick Start:** Read [STANDARDS-QUICK-REFERENCE.md](STANDARDS-QUICK-REFERENCE.md)
2. **Complete Guide:** Read [TEST-STANDARDS.md](TEST-STANDARDS.md)
3. **Examples:** Review reference test files in `../tests/`, `../pom/`, `../fixtures/`

### For Using Agents
1. **Planner:** Request test plan for a feature
2. **Generator:** Provide test plan, get implementation
3. **Healer:** Point to failing tests, get fixes

## 📋 Key Standards at a Glance

### Imports (Never use @playwright/test)
```typescript
✅ import { test } from "../fixtures/appbase";
❌ import { test } from "@playwright/test";
```

### Page Object Access (All UI through App fixture)
```typescript
✅ await App.loginPage.clickOnLogin();
❌ await page.click('...');
```

### Credentials (Use testData fixture)
```typescript
✅ testData.username, testData.password
❌ 'hardcoded_user', 'hardcoded_password'
```

### Test Data (From testdata/ directory)
```typescript
✅ import { employees } from "../testdata/emp.json";
❌ const employees = [{...}, {...}];
```

## 📁 Reference Files

Example implementations in the project:

**POM Examples:**
- `../pom/basepage.ts` - Base class for all page objects
- `../pom/loginpage.ts` - Complete POM implementation example

**Fixture Example:**
- `../fixtures/appbase.ts` - Custom fixture with page objects

**Test Examples:**
- `../tests/19POMTestWithBaseAppDDT.spec.ts` - Pattern A: Separate tests
- `../tests/20POMTestWithBaseAppDDTNormalLoop.spec.ts` - Pattern B: With steps

**Data Examples:**
- `../testdata/emp.json` - Domain data pattern
- `../testdata/creds.ts` - Credentials pattern

## 🔍 Finding What You Need

| Need | File | Section |
|------|------|---------|
| Complete standards | TEST-STANDARDS.md | All |
| Quick lookup | STANDARDS-QUICK-REFERENCE.md | Various |
| POM standards | TEST-STANDARDS.md | Section 1 |
| Fixture standards | TEST-STANDARDS.md | Section 2 |
| Test data standards | TEST-STANDARDS.md | Section 3 |
| Test file standards | TEST-STANDARDS.md | Section 4 |
| Planner agent guide | TEST-STANDARDS.md | Section 5.1 |
| Generator agent guide | TEST-STANDARDS.md | Section 5.2 |
| Healer agent guide | TEST-STANDARDS.md | Section 5.3 |
| Common workflows | TEST-STANDARDS.md | Section 7 |
| Validation checklist | TEST-STANDARDS.md | Section 9 |
| Agent improvements | AGENT-ENHANCEMENTS.md | All |
| What changed | AGENT-UPDATES-SUMMARY.md | All |
| Red flags | STANDARDS-QUICK-REFERENCE.md | Red Flags section |
| File structure | STANDARDS-QUICK-REFERENCE.md | File Structure |
| Naming conventions | STANDARDS-QUICK-REFERENCE.md | POM Naming |

## ✅ Validation Checklist

Before committing new tests, verify:

- [ ] Imports from `fixtures/appbase`, not `@playwright/test`
- [ ] All UI interactions through `App.` fixture
- [ ] All credentials through `testData.` fixture
- [ ] Test data imported from `testdata/` directory
- [ ] File in `tests/` directory with `.spec.ts` extension
- [ ] Clear `describe()` suite name
- [ ] Descriptive test name (not generic)
- [ ] Comments explaining each step
- [ ] Verification after each action
- [ ] No hardcoded URLs, credentials, or data
- [ ] Data-driven tests use loop pattern

## 🤝 Contributing

When creating new tests, standards, or patterns:

1. Follow the established conventions in this repository
2. Reference TEST-STANDARDS.md for guidance
3. Update relevant documentation if changing standards
4. Use STANDARDS-QUICK-REFERENCE.md for quick lookup
5. Provide examples following existing patterns

## 📊 Version Information

| Document | Version | Updated | Status |
|----------|---------|---------|--------|
| TEST-STANDARDS.md | 1.0 | 2026-11-11 | Active |
| STANDARDS-QUICK-REFERENCE.md | 1.0 | 2026-11-11 | Active |
| AGENT-ENHANCEMENTS.md | 1.0 | 2026-11-11 | Active |
| AGENT-UPDATES-SUMMARY.md | 1.0 | 2026-11-11 | Active |
| Planner Agent | 2.0 | 2026-11-11 | Enhanced |
| Generator Agent | 2.0 | 2026-11-11 | Enhanced |
| Healer Agent | 2.0 | 2026-11-11 | Enhanced |

## 📞 Support

For help:
1. Check STANDARDS-QUICK-REFERENCE.md for quick answers
2. Read TEST-STANDARDS.md for complete information
3. Review example files in `../tests/`, `../pom/`, etc.
4. Check AGENT-ENHANCEMENTS.md for agent-specific guidance

---

**Repository:** vibetestq-tamash/pw-sept10  
**Last Updated:** 2026-11-11  
**Created for:** Playwright test automation with Page Object Model pattern
