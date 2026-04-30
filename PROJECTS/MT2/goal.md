TASK: Use the following goal to create proposed use cases in `1-USE-CASES-PROPOSED.md`. Then, after review and approval, formalise them into `1-USE-CASES.md` for pipeline delivery.

# Goal
Following best practices for LLM based work, please create an example directory structure and a README that shows how one might organize a project's agents, skills, instructions, etc. Feel free to add example files with placeholder content to illustrate the structure. The structure should be flexible enough to accommodate various types of projects, such as software development, content creation, or research. 

There should be a pipeline and each agent has a specific role in that pipeline. The pipeline has phases, and each phase has specific agents that perform tasks relevant to that phase. There are source of truth artifacts (SOTA) where an agent owns a particular artifact (for example Agent A owns artifact X, and is responsible for maintaining it). 

My Preference would be to make a Pipeline with these stages
1. IDEATION - done by Human
2. USE CASES - done by a business analyst agent
3. REQUIREMENTS - done by a requirements engineer agent
4. DESIGN(HOW) - done by a design agent
5. IMPLEMENTATION - done by a development agent
6. TESTING - done by a testing agent

