import 'babel-polyfill';
import process from 'process';
import child_process from 'child_process';

export class GulpDockerCompose
{
    constructor(gulp, options = {})
    {
        if (!gulp)
        {
            throw new Error('Gulp instance not provided');
        }

        this._gulp = gulp;
        this._options = options || {};

        this.makeTasks();
        this.handOnInt();
    }

    makeTasks()
    {
        const t = this.getTasks();
        if (t)
        {
            let name = '';
            let task;

            if (t.run)
            {
                task = t.run;
                name = this.isStringNotEmpty(task.name) ? task.name : 'docker-compose:run:#SERVICE_NAME#';

                this.makeMainTask(task.dependences, name);
            }
            if (t.restart)
            {
                task = t.restart;
                name = this.isStringNotEmpty(task.name) ? task.name : 'docker-compose:restart:#SERVICE_NAME#';

                this.makeMainTask(task.dependences, name);
            }
            if (t.watchYML)
            {
                task = t.watchYML;
                name = this.isStringNotEmpty(task.name) ? task.name : 'docker-compose:watch-yml';
                const nameRestart = this.isStringNotEmpty(task.nameRestart) ? task.nameRestart : 'docker-compose:restart-all';

                this.makeWatchYMLTask(name, nameRestart);
            }
        }
    }

    makeMainTask(dependences = [], name = 'docker-compose:run:#SERVICE_NAME#')
    {
        const upExtra = this.getExtraArgs().upOnRun || '';

        this.getGulp().task(this.prepareName(name), dependences, () => {
            return this.exec(`docker-compose up -d --build ${upExtra}`).then((output) => {
                this.printOutput(...output);
            }).catch((error) => {
                console.error(error.message);
            });
        });
    }

    makeWatchYMLTask(name, nameRestart)
    {
        const upExtra = this.getExtraArgs().upOnYMLChange || '';
        const projectFolder = this.getOptions().projectFolder || './';

        const gulp = this.getGulp();

        gulp.task(this.prepareName(nameRestart), () => {
            return this.exec(`docker-compose up -d --remove-orphans ${upExtra}`).then((output) => {
                this.printOutput(...output);
            }).catch((error) => {
                console.error(error.message);
            });
        });
        this.getGulp().task(this.prepareName(name), () => {
            gulp.watch([`${projectFolder}/docker-compose.yml`], [nameRestart]);
        });
    }

    prepareName(name)
    {
        return name.replace('#SERVICE_NAME#', this.isStringNotEmpty(this.getServiceName()) ? this.getServiceName() : '');
    }

    async exec(cmd)
    {
        if (this.getOptions().exposeCLICommands)
        {
            console.log(`> ${cmd}`);
        }

        return new Promise((resolve, reject) => {
            child_process.exec(cmd, {
                windowsHide: true,
            }, function(error, stdout, stderr) {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve([stdout, stderr]);
                }
            });
        });
    }

    handOnInt()
    {
        if (this.getOptions().hangOnInt === false)
        {
            return;
        }

        process.on('SIGINT', () => {
            this.stopDockerCompose().then(() => {
                process.exit(0);
            });
        });
    }

    stopDockerCompose()
    {
        const stopAllExtra = this.getExtraArgs().stopAll || '';

        return this.exec(`docker-compose stop ${stopAllExtra}`).then((output) => {
            this.printOutput(...output);
        }).catch((error) => {
            console.error(error.message);
        });
    }

    printOutput(stdout, stderr)
    {
        if (stdout && this.getOptions().exposeStdOut === true) {
            console.log(stdout.toString());
        }
        if (stderr && this.getOptions().exposeStdErr !== false) {
            console.log(stderr.toString());
        }
    }

    getGulp()
    {
        return this._gulp;
    }

    getServiceName()
    {
        return this.getOptions().serviceName || '';
    }

    getExtraArgs()
    {
        return this.getOptions().extraArgs || {};
    }

    getOptions()
    {
        return this._options || {};
    }

    getTasks()
    {
        return this.getOptions().tasks || {};
    }

    isStringNotEmpty(val)
    {
        return typeof val === 'string' && val.length > 0;
    }
}

export default GulpDockerCompose;
