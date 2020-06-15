type CommandsInfo = {
  title: string;
  isRunning: boolean;
  commands: {
    run: string;
    output: string | null;
  }[];
};

function getCommands(text: string): CommandsInfo {
  const [, ...lines] = text.split(/^\$\s*/gm);
  const commands = lines.map((c) => {
    const [run, ...outputLines] = c.split(/\r?\n/);
    return {
      run,
      output: outputLines.length > 0 ? outputLines.join("\n") : null,
    };
  });

  const lastCommand = commands[commands.length - 1];
  const isRunning = commands.length > 0 && lastCommand.output != null;
  const title = isRunning ? lastCommand.run.split(/(\s+)/)[0] : "bash";
  return {
    title,
    isRunning,
    commands,
  };
}

export { getCommands };
export type { CommandsInfo };
