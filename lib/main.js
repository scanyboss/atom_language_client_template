const {AutoLanguageClient} = require('atom-languageclient');
const cp = require('child_process');
const path = require('path');

class DSLLanguageClient extends AutoLanguageClient {
    getGrammarScopes() {
      // TODO specify file extension of your language server in format:  source.<extension>
        return ['source.ml']
    }

    // TODO specify name of your language
    getLanguageName() {
        return 'MealyMachineDSL'
    }

    // TODO specify server name
    getServerName() {
        return 'MealyMachine'
    }

    startServerProcess(projectPath) {
        const serverHome = path.join(__dirname, 'server');
        const args = [];
        //TODO specify name of the Fat JAR language server,e.g. org.stateMachine.ide-1.0.0-SNAPSHOT-ls.jar
        const languageServerName = "org.mealy.ide-1.0.0-SNAPSHOT-ls.jar";
        args.push(
            '-jar', path.join(serverHome,languageServerName)
        );
        console.log(args);
        console.log(serverHome);
        const childProcess = cp.spawn('java', args,{ cwd: serverHome });
        this.captureServerErrors(childProcess);
        childProcess.on('close', exitCode => {
            if (!childProcess.killed) {
              //TODO specify language name, e.g. IDE--MyDslDSL
              const languageName = "";
                atom.notifications.addError(languageName + ' language server stopped unexpectedly.', {
                    dismissable: true,
                    description: this.processStdErr ? `<code>${this.processStdErr}</code>` : `Exit code ${exitCode}`
                })
            }
        });
        return childProcess;
    }
}

module.exports = new DSLLanguageClient();
