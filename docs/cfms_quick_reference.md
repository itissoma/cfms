i# 🔍 QUICK REFERENCE - How to Use CFMS Documentation in New Threads

**Purpose:** Guide for starting new threads with full context from this project

---

## 🧠 THE CONTEXT CHALLENGE

**Reality:** Each new thread starts fresh without memory of previous conversations.

**Solution:** Use `project_knowledge_search` to retrieve documentation created in this project.

---

## 📚 AVAILABLE DOCUMENTATION

### 1. **Master TODO List** (`cfms_master_todo_list.md`)
- **Contains:** All 32 TODO items across 3 phases
- **Use When:** Planning what to implement next
- **Search Terms:** "Phase 1 TODO", "Phase 2 workflow", "Phase 3 production"

### 2. **Feasibility Analysis** (`cfms_feasibility_analysis.md`)
- **Contains:** Technical assessment, approaches, risks for each TODO
- **Use When:** Need implementation details or technical guidance
- **Search Terms:** "feasibility landing page", "workflow implementation", "multi-tenancy"

### 3. **v0.84 Summary** (`cfms_v084_summary.md`)
- **Contains:** Complete current system status, what's working, what's not
- **Use When:** Need to understand current state before making changes
- **Search Terms:** "v0.84 status", "current issues", "what's working"

### 4. **This Guide** (`cfms_quick_reference.md`)
- **Contains:** How to use the documentation system
- **Use When:** You forget how to reference past work 😊

---

## 🎯 HOW TO START A NEW THREAD

### Scenario 1: Implement Specific Phase

**What You Say:**
> "Let's implement Phase 1 navigation fixes from the master TODO list"

**What Claude Does:**
```
1. Calls project_knowledge_search with query: "Phase 1 navigation TODO"
2. Finds master TODO list
3. Reads Phase 1 scope (TODO-001 through TODO-010)
4. Proceeds with implementation
```

**Result:** Claude has full context of what Phase 1 means ✅

---

### Scenario 2: Need Technical Details

**What You Say:**
> "How do we fix the landing page issue? Check the feasibility analysis"

**What Claude Does:**
```
1. Calls project_knowledge_search with query: "landing page feasibility"
2. Finds feasibility analysis document
3. Reads the 3 technical approaches
4. Recommends best approach
```

**Result:** Claude provides detailed technical guidance ✅

---

### Scenario 3: Check Current System Status

**What You Say:**
> "What's the current status of CFMS? What's working and what's broken?"

**What Claude Does:**
```
1. Calls project_knowledge_search with query: "v0.84 status current"
2. Finds v0.84 summary document
3. Reviews what's working and known issues
4. Provides current state overview
```

**Result:** Claude understands the current system ✅

---

### Scenario 4: Continue Previous Work

**What You Say:**
> "Let's continue working on the breadcrumb navigation fix from last time"

**What Claude Does:**
```
1. Calls project_knowledge_search with query: "breadcrumb navigation fix TODO"
2. Finds TODO-008, TODO-009, TODO-010
3. Checks feasibility analysis for implementation approach
4. Continues where previous thread left off
```

**Result:** Seamless continuation ✅

---

## 🔑 EFFECTIVE SEARCH TERMS

### For Phase-Specific Work:
- "Phase 1 navigation"
- "Phase 2 workflow approval"
- "Phase 3 production environment"

### For Technical Implementation:
- "feasibility [topic]" - e.g., "feasibility landing page"
- "implementation [feature]" - e.g., "implementation breadcrumb"
- "approach [problem]" - e.g., "approach dropdown menu"

### For Status & Context:
- "v0.84 status"
- "current issues"
- "what's working"
- "known problems"

### For Specific TODOs:
- "TODO-001" (specific item number)
- "landing page TODO"
- "footer cleanup TODO"

---

## 📋 STEP-BY-STEP NEW THREAD TEMPLATE

### Template A: Start New Phase

```
Hi Claude! I want to implement Phase [X] from the CFMS master TODO list.

Please:
1. Search the project knowledge for Phase [X] details
2. Review the scope and TODO items
3. Check the feasibility analysis for implementation approaches
4. Let me know what we'll be doing and estimated time

Then we can start implementing.
```

### Template B: Continue Specific Item

```
Hi Claude! Let's work on TODO-[XXX] from the CFMS master TODO list.

Please:
1. Find this TODO item in project knowledge
2. Check the feasibility analysis for technical approach
3. Review v0.84 status to understand current state
4. Propose implementation plan

Ready to code!
```

### Template C: Debug or Check Status

```
Hi Claude! I need to understand the current state of CFMS.

Please:
1. Search for v0.84 status in project knowledge
2. Tell me what's currently working
3. Tell me what known issues exist
4. Let me know what's planned next (Phase 1/2/3)
```

---

## 🎓 TIPS FOR SUCCESS

### DO:
- ✅ Reference specific phase numbers (Phase 1, 2, 3)
- ✅ Mention TODO numbers when you know them
- ✅ Ask Claude to "check project knowledge" or "search the TODO list"
- ✅ Be specific about what you're trying to accomplish
- ✅ Mention version numbers (v0.84, v0.85) for context

### DON'T:
- ❌ Assume Claude remembers previous conversations
- ❌ Say "as we discussed last time" without context
- ❌ Reference things not in project documentation
- ❌ Expect Claude to know about changes made outside documented work

---

## 🔍 SEARCH EXAMPLES

### Example 1: Starting Phase 1
**User:** "Let's implement Phase 1 from the TODO list"  
**Claude Searches:** `project_knowledge_search("Phase 1 navigation TODO")`  
**Finds:** Master TODO list, Phase 1 section  
**Result:** ✅ Full context

### Example 2: Technical Details
**User:** "How do we fix breadcrumb navigation? Check the feasibility doc"  
**Claude Searches:** `project_knowledge_search("breadcrumb navigation feasibility")`  
**Finds:** Feasibility analysis, section 1.4  
**Result:** ✅ Technical approaches with code examples

### Example 3: Current Status
**User:** "What's broken right now?"  
**Claude Searches:** `project_knowledge_search("v0.84 known issues")`  
**Finds:** v0.84 summary, known issues section  
**Result:** ✅ Complete list of issues

### Example 4: Multi-Document Search
**User:** "Let's work on TODO-006 footer cleanup - show me the plan and how to implement it"  
**Claude Searches:**  
1. `project_knowledge_search("TODO-006 footer")`  
2. `project_knowledge_search("footer cleanup feasibility")`  
**Finds:** TODO details + technical approach  
**Result:** ✅ Complete implementation plan

---

## 🚨 WHAT IF SEARCH FAILS?

### If Claude Can't Find Documentation:

**Possible Reasons:**
1. Documentation not yet added to project (need to move from outputs)
2. Search terms too specific or too vague
3. Information truly doesn't exist yet

**What To Do:**
1. Try broader search terms
2. Ask Claude to search for "master TODO" or "v0.84 status"
3. Provide the information directly in the new thread
4. Create new documentation if needed

---

## 📦 DOCUMENTATION LOCATIONS

### Where Documents Are Stored:

**Staging (After Creation):**
```
/home/claude/
├── cfms_master_todo_list.md
├── cfms_feasibility_analysis.md
├── cfms_v084_summary.md
└── cfms_quick_reference.md
```

**For Download:**
```
/mnt/user-data/outputs/
├── cfms_master_todo_list.md
├── cfms_feasibility_analysis.md
├── cfms_v084_summary.md
└── cfms_quick_reference.md
```

**In Project (Searchable):**
```
These docs will be searchable via project_knowledge_search
once they're added to the project knowledge base
```

---

## 🎯 REAL-WORLD USAGE EXAMPLES

### Example 1: Monday Morning, New Week

**User:** "Hi Claude! Let's pick up where we left off. Can you check what phase we're on and what's next?"

**Claude:**
```
[Searches project knowledge for "current status phase"]
[Finds v0.84 summary]

"We're at v0.84. Phase 1 navigation fixes are planned next (v0.85).
Specifically, we need to:
- Fix landing page redirect (TODO-001)
- Clean up user dropdown (TODO-004/005)
- Remove footer elements (TODO-006/007)
- Fix breadcrumb navigation (TODO-008/009/010)

Ready to start with the landing page fix?"
```

---

### Example 2: Specific Feature Request

**User:** "I want to add the approval workflow we discussed. Can you find the plan?"

**Claude:**
```
[Searches project knowledge for "Phase 2 workflow approval"]
[Finds master TODO and feasibility analysis]

"Found it! Phase 2 covers the approval workflow (TODO-011 through TODO-019).
The plan uses Frappe's built-in Workflow engine.

Key points:
- States: Draft → Pending → Approved/Rejected/Hold
- Email notifications automatic
- Estimated effort: 1-2 days
- Low risk (native feature)

Should we start with the workflow design (TODO-011)?"
```

---

### Example 3: Technical Question

**User:** "What's the best way to implement the landing page redirect?"

**Claude:**
```
[Searches project knowledge for "landing page feasibility"]
[Finds 3 approaches in feasibility analysis]

"The feasibility analysis shows 3 approaches:

1. Role-Based (10 min, very low risk) - RECOMMENDED
2. JavaScript Redirect (15 min, low risk) - BACKUP
3. Python Hook (30 min, low risk) - MOST ROBUST

Recommendation: Use #1 + #2 (defense in depth).
Should I proceed with implementation?"
```

---

## ✅ SUCCESS CHECKLIST

Before starting a new thread, make sure:
- [ ] I know which phase I want to work on
- [ ] I have specific goals (or will ask Claude to find them)
- [ ] I understand Claude will need to search project knowledge
- [ ] I'm ready to reference TODO numbers or phase names
- [ ] I won't expect Claude to "remember" previous conversations

**If all checked:** You're ready for a successful new thread! 🚀

---

## 🌟 SUMMARY

**Key Takeaway:** Claude can access project documentation through `project_knowledge_search`, but YOU need to prompt it.

**Magic Words:**
- "Check the master TODO list"
- "Search project knowledge for [topic]"
- "Find Phase [X] in the documentation"
- "What does the feasibility analysis say about [feature]?"
- "What's the current status according to v0.84?"

**With These Phrases:** Claude will retrieve full context and continue work seamlessly!

---

**Document Version:** 1.0  
**Created:** 2025-10-30  
**Purpose:** Enable effective context transfer across threads  
**Status:** ACTIVE REFERENCE GUIDE
