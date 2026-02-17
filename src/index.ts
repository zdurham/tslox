import { argv, exit, stdin, stdout } from 'node:process';
import { Scanner } from './scanner';
import { readFileSync } from 'node:fs';
import * as readline from 'node:readline';


export class Lox {
  hadError = false;

  main() {
    if (argv.length > 3) {
      console.log("nah brah just one arg");
    } else if (argv.length == 3) {
      this.runFile(argv[2]);
    } else if (argv.length == 2) {
      this.runPrompt();
    }
  }

  runFile(filePath: string) {
    const fileContents = readFileSync('./' + filePath, { encoding: 'utf8' });
    this.run(fileContents)
    if (this.hadError) {
      exit(65);
    }

  }

  runPrompt() {
    const rl = readline.createInterface({
      prompt: "> ",
      input: stdin,
      output: stdout
    });

    rl.prompt();
    rl.on("line", (line) => {
      if (line === 'exit') {
        exit(0)
      }
      this.run(line);
      this.hadError = false;
      rl.prompt();
    })
  }

  run(source: string) {
    const tokens = new Scanner(source).scanTokens();
    console.log("the tokens bruv: ", tokens);
  }
}



