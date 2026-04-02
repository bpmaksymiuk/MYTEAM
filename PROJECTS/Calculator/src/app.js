(() => {
  const displayEl = document.getElementById("display");
  const pad = document.getElementById("pad");
  const memoryIndicator = document.getElementById("memory-indicator");

  if (!displayEl || !pad || !memoryIndicator) {
    return;
  }

  const state = {
    entry: "0",
    accumulator: null,
    operator: null,
    waitingForNextEntry: false,
    error: false,
    memory: 0,
    hasMemory: false
  };

  function render() {
    displayEl.textContent = state.entry;
    memoryIndicator.classList.toggle("active", state.hasMemory);
  }

  function setError(message = "Error") {
    state.error = true;
    state.entry = message;
    state.waitingForNextEntry = true;
    state.operator = null;
    state.accumulator = null;
    render();
  }

  function clearAll() {
    state.entry = "0";
    state.accumulator = null;
    state.operator = null;
    state.waitingForNextEntry = false;
    state.error = false;
    render();
  }

  function clearEntry() {
    if (state.error) {
      clearAll();
      return;
    }
    state.entry = "0";
    state.waitingForNextEntry = false;
    render();
  }

  function pushDigit(digit) {
    if (state.error) {
      clearAll();
    }

    if (state.waitingForNextEntry) {
      state.entry = digit;
      state.waitingForNextEntry = false;
    } else if (state.entry === "0") {
      state.entry = digit;
    } else {
      state.entry += digit;
    }

    render();
  }

  function pushDot() {
    if (state.error) {
      clearAll();
    }

    if (state.waitingForNextEntry) {
      state.entry = "0.";
      state.waitingForNextEntry = false;
      render();
      return;
    }

    if (!state.entry.includes(".")) {
      state.entry += ".";
      render();
    }
  }

  function backspace() {
    if (state.error || state.waitingForNextEntry) {
      return;
    }

    if (state.entry.length <= 1) {
      state.entry = "0";
    } else {
      state.entry = state.entry.slice(0, -1);
    }

    if (state.entry === "-" || state.entry === "") {
      state.entry = "0";
    }

    render();
  }

  function toNumber(entry) {
    const n = Number(entry);
    return Number.isFinite(n) ? n : null;
  }

  function formatNumber(n) {
    if (!Number.isFinite(n)) {
      return "Error";
    }
    const str = String(n);
    return str.length > 16 ? n.toPrecision(12) : str;
  }

  function executeOperation(lhs, rhs, op) {
    switch (op) {
      case "+":
        return lhs + rhs;
      case "-":
        return lhs - rhs;
      case "*":
        return lhs * rhs;
      case "/":
        if (rhs === 0) {
          return Infinity;
        }
        return lhs / rhs;
      default:
        return rhs;
    }
  }

  function handleOperator(nextOperator) {
    if (state.error) {
      return;
    }

    const inputValue = toNumber(state.entry);
    if (inputValue === null) {
      setError();
      return;
    }

    if (state.accumulator === null) {
      state.accumulator = inputValue;
    } else if (state.operator && !state.waitingForNextEntry) {
      const result = executeOperation(state.accumulator, inputValue, state.operator);
      if (!Number.isFinite(result)) {
        setError("Cannot divide by zero");
        return;
      }
      state.accumulator = result;
      state.entry = formatNumber(result);
    }

    state.operator = nextOperator;
    state.waitingForNextEntry = true;
    render();
  }

  function handleEquals() {
    if (state.error || !state.operator) {
      return;
    }

    const rhs = toNumber(state.entry);
    if (rhs === null) {
      setError();
      return;
    }

    const result = executeOperation(state.accumulator ?? 0, rhs, state.operator);
    if (!Number.isFinite(result)) {
      setError("Cannot divide by zero");
      return;
    }

    state.entry = formatNumber(result);
    state.accumulator = result;
    state.operator = null;
    state.waitingForNextEntry = true;
    render();
  }

  function handleMemory(command) {
    if (state.error && command !== "mc") {
      return;
    }

    const current = toNumber(state.entry);

    switch (command) {
      case "ms":
        if (current !== null) {
          state.memory = current;
          state.hasMemory = true;
        }
        break;
      case "mr":
        state.entry = formatNumber(state.memory);
        state.waitingForNextEntry = false;
        break;
      case "mc":
        state.memory = 0;
        state.hasMemory = false;
        break;
      case "mplus":
        if (current !== null) {
          state.memory += current;
          state.hasMemory = true;
        }
        break;
      case "mminus":
        if (current !== null) {
          state.memory -= current;
          state.hasMemory = true;
        }
        break;
      default:
        break;
    }

    render();
  }

  function handleCommand(command) {
    switch (command) {
      case "back":
        backspace();
        break;
      case "ce":
        clearEntry();
        break;
      case "c":
        clearAll();
        break;
      case "eq":
        handleEquals();
        break;
      case "dot":
        pushDot();
        break;
      case "ms":
      case "mr":
      case "mc":
      case "mplus":
      case "mminus":
        handleMemory(command);
        break;
      default:
        break;
    }
  }

  function dispatchFromButton(button) {
    if (!button) {
      return;
    }

    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 80);

    const num = button.dataset.num;
    const op = button.dataset.op;
    const cmd = button.dataset.cmd;

    if (num !== undefined) {
      pushDigit(num);
      return;
    }
    if (op) {
      handleOperator(op);
      return;
    }
    if (cmd) {
      handleCommand(cmd);
    }
  }

  pad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    dispatchFromButton(button);
  });

  const keyMap = {
    Enter: { cmd: "eq" },
    "=": { cmd: "eq" },
    Escape: { cmd: "c" },
    Delete: { cmd: "ce" },
    Backspace: { cmd: "back" },
    ".": { cmd: "dot" },
    "/": { op: "/" },
    "*": { op: "*" },
    "-": { op: "-" },
    "+": { op: "+" }
  };

  document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      pushDigit(key);
      return;
    }

    const map = keyMap[key];
    if (!map) {
      return;
    }

    event.preventDefault();
    if (map.op) {
      handleOperator(map.op);
    } else if (map.cmd) {
      handleCommand(map.cmd);
    }
  });

  render();
})();
