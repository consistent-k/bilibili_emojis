import chalk from 'chalk';

const log = {
    success: (msg: any) => {
        console.log(chalk.green(`✔ ${msg}`));
    },
    error: (msg: any) => {
        console.log(chalk.red(`✖ ${msg}`));
    },
    warning: (msg: any) => {
        console.log(chalk.yellow(`⚠ ${msg}`));
    },
    info: (msg: any) => {
        console.log(chalk.cyan(`ℹ ${msg}`));
    },
    debug: (msg: any) => {
        console.log(chalk.magenta(`🐞 ${msg}`));
    }
};

export default log;
