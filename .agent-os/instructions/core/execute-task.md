---
description: Rules to execute a task and its sub-tasks using Agent OS for Astro projects
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Task Execution Rules - Astro Project

## Overview

Execute a specific Astro task along with its sub-tasks systematically following a TDD development workflow with islands architecture, content collections, and static site generation patterns.

<pre_flight_check>
  EXECUTE: @.agent-os/instructions/meta/pre-flight.md
</pre_flight_check>

<process_flow>

<step number="1" name="task_understanding">

### Step 1: Task Understanding

Read and analyze the given parent task and all its sub-tasks from tasks.md to gain complete understanding of what needs to be built in the Astro context.

<task_analysis>
  <read_from_tasks_md>
    - Parent task description
    - All sub-task descriptions
    - Task dependencies
    - Expected outcomes
    - Astro specific requirements (SSG/islands/content)
  </read_from_tasks_md>
</task_analysis>

<instructions>
  ACTION: Read the specific parent task and all its sub-tasks
  ANALYZE: Full scope of Astro implementation required
  UNDERSTAND: Dependencies and expected deliverables
  NOTE: Test requirements for each sub-task
  IDENTIFY: Astro features needed (components, islands, content collections)
</instructions>

</step>

<step number="2" name="technical_spec_review">

### Step 2: Technical Specification Review

Search and extract relevant sections from technical-spec.md to understand the Astro technical implementation approach for this task.

<selective_reading>
  <search_technical_spec>
    FIND sections in technical-spec.md related to:
    - Current task functionality
    - Astro implementation approach (SSG/SSR/Hybrid)
    - Integration requirements (Supabase Auth, Stripe, etc.)
    - Performance criteria and Core Web Vitals
    - Content collection patterns
  </search_technical_spec>
</selective_reading>

<instructions>
  ACTION: Search technical-spec.md for task-relevant sections
  EXTRACT: Only implementation details for current task
  SKIP: Unrelated technical specifications
  FOCUS: Astro technical approach for this specific feature
</instructions>

</step>

<step number="3" subagent="context-fetcher" name="best_practices_review">

### Step 3: Best Practices Review

Use the context-fetcher subagent to retrieve relevant sections from @.agent-os/project_types/astro/standards/best-practices.md that apply to the current task's Astro patterns and feature type.

<selective_reading>
  <search_best_practices>
    FIND sections relevant to:
    - Astro component patterns
    - Islands architecture approaches
    - Content collection strategies
    - Supabase integration patterns
    - Static site optimization
  </search_best_practices>
</selective_reading>

<instructions>
  ACTION: Use context-fetcher subagent
  REQUEST: "Find Astro best practices sections relevant to:
            - Task's Astro patterns: [CURRENT_ASTRO_FEATURE]
            - Feature type: [CURRENT_FEATURE_TYPE]
            - Islands architecture and testing approaches
            - Content collection patterns"
  PROCESS: Returned Astro best practices
  APPLY: Relevant patterns to implementation
</instructions>

</step>

<step number="4" subagent="context-fetcher" name="tdd_patterns_review">

### Step 4: TDD Patterns Review

Use the context-fetcher subagent to retrieve relevant TDD patterns from @.agent-os/project_types/astro/standards/tdd-patterns.md for the current task implementation.

<selective_reading>
  <search_tdd_patterns>
    FIND TDD patterns for:
    - Astro component testing with Vitest
    - Islands testing strategies
    - Content collection validation
    - API route testing
    - E2E testing patterns
  </search_tdd_patterns>
</selective_reading>

<instructions>
  ACTION: Use context-fetcher subagent
  REQUEST: "Find Astro TDD patterns for:
            - Component type: [COMPONENT_TYPE]
            - Testing framework: Vitest
            - Islands architecture: [IF_APPLICABLE]
            - Content collections: [IF_APPLICABLE]"
  PROCESS: Returned TDD patterns
  APPLY: RED-GREEN-REFACTOR cycle for Astro
</instructions>

</step>

<step number="5" name="astro_task_execution">

### Step 5: Astro Task and Sub-task Execution

Execute the parent task and all sub-tasks in order using Astro TDD approach with Vitest and islands architecture.

<tdd_execution_cycle>
  <red_phase>
    - Write failing tests using Vitest
    - Include component tests, content tests, API tests
    - Test islands hydration if applicable
    - Verify tests fail as expected
  </red_phase>
  <green_phase>
    - Implement minimal Astro components/islands
    - Use Tailwind CSS for styling
    - Integrate content collections properly
    - Make tests pass with minimal code
  </green_phase>
  <refactor_phase>
    - Enhance components with better styling
    - Add proper TypeScript types
    - Optimize for static site generation
    - Improve code quality while keeping tests green
  </refactor_phase>
</tdd_execution_cycle>

<execution_order>
  <subtask_1_tests>
    IF sub-task 1 is "Write tests for [feature]":
      - Write Astro component tests with Vitest
      - Write content collection tests if applicable
      - Write islands integration tests if applicable
      - Include rendering and interaction tests
      - Run tests to ensure they fail appropriately
      - Mark sub-task 1 complete
  </subtask_1_tests>

  <middle_subtasks_implementation>
    FOR each implementation sub-task (2 through n-1):
      - Implement Astro components using SSG patterns
      - Create content collections with proper schemas
      - Build islands with appropriate hydration
      - Set up API routes if needed
      - Make relevant tests pass
      - Update any adjacent/related tests if needed
      - Refactor while keeping tests green
      - Mark sub-task complete
  </middle_subtasks_implementation>

  <final_subtask_verification>
    IF final sub-task is "Verify all tests pass":
      - Run vitest test suite
      - Run astro check for TypeScript validation
      - Fix any remaining failures
      - Ensure no regressions
      - Verify static site builds successfully
      - Mark final sub-task complete
  </final_subtask_verification>
</execution_order>

<astro_specific_considerations>
  <static_generation>
    - Ensure components render at build time
    - Use appropriate Astro directives for hydration
    - Optimize for fast loading with minimal JavaScript
  </static_generation>
  <islands_architecture>
    - Use islands sparingly for interactive components
    - Choose appropriate hydration strategy (load, idle, visible)
    - Test island interactivity properly
  </islands_architecture>
  <content_collections>
    - Define proper schema validation
    - Handle dynamic routing properly
    - Test content processing pipelines
  </content_collections>
</astro_specific_considerations>

<instructions>
  ACTION: Execute sub-tasks in their defined order
  RECOGNIZE: First sub-task typically writes all tests
  IMPLEMENT: Middle sub-tasks build Astro functionality
  VERIFY: Final sub-task ensures all tests pass
  UPDATE: Mark each sub-task complete as finished
  FOLLOW: Astro best practices and islands architecture
</instructions>

</step>

<step number="6" subagent="astro-test-runner" name="astro_test_verification">

### Step 6: Astro Test Verification

Use the astro-test-runner subagent to run and verify only the tests specific to this parent task to ensure the Astro feature is working correctly.

<focused_test_execution>
  <run_only>
    - All new component tests for this task
    - All content collection tests for this task
    - All islands tests written for this feature
    - API route tests if applicable
    - Tests directly related to this Astro feature
  </run_only>
  <skip>
    - Full test suite (done later in execute-tasks.md)
    - Unrelated test files
  </skip>
</focused_test_execution>

<astro_test_types>
  <unit_tests>
    - Component rendering tests
    - Utility function tests
    - Content validation tests
  </unit_tests>
  <integration_tests>
    - Islands hydration tests
    - Content collection processing
    - API route functionality
  </integration_tests>
  <build_tests>
    - Static site generation validation
    - Asset optimization verification
    - Route generation testing
  </build_tests>
</astro_test_types>

<final_verification>
  IF any test failures:
    - Debug and fix the specific Astro issue
    - Check astro check output for TypeScript errors
    - Verify content schema validation
    - Re-run only the failed tests
  ELSE:
    - Confirm all task tests passing
    - Verify astro build succeeds
    - Ready to proceed
</final_verification>

<instructions>
  ACTION: Use astro-test-runner subagent
  REQUEST: "Run Astro tests for [this parent task's test files]"
  WAIT: For test-runner analysis
  PROCESS: Returned failure information
  VERIFY: 100% pass rate for task-specific tests
  CONFIRM: This Astro feature's tests are complete
</instructions>

</step>

<step number="7" name="task_status_updates">

### Step 7: Mark this task and sub-tasks complete

IMPORTANT: In the tasks.md file, mark this task and its sub-tasks complete by updating each task checkbox to [x].

<update_format>
  <completed>- [x] Task description</completed>
  <incomplete>- [ ] Task description</incomplete>
  <blocked>
    - [ ] Task description
    ⚠️ Blocking issue: [DESCRIPTION]
  </blocked>
</update_format>

<blocking_criteria>
  <attempts>maximum 3 different approaches</attempts>
  <action>document blocking issue</action>
  <emoji>⚠️</emoji>
</blocking_criteria>

<instructions>
  ACTION: Update tasks.md after each task completion
  MARK: [x] for completed items immediately
  DOCUMENT: Blocking issues with ⚠️ emoji
  LIMIT: 3 attempts before marking as blocked
</instructions>

</step>

</process_flow>

<post_flight_check>
  EXECUTE: @.agent-os/instructions/meta/post-flight.md
</post_flight_check>