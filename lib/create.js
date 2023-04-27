const prompt = require('prompt');
const shell = require('shelljs');
const fs = require('fs');
const colors = require("colors/safe");

/**
 * Set prompt as green and use the "Replace" text
 */
prompt.message = colors.green("Component");


module.exports = async (args, options, logger) => {

    const localPath = process.cwd();

    logger.info('Please fill the following values…');

    const schema = {
        properties: {
            name: {
                pattern: /([A-Z][a-z0-9]+)+/,
                description: "Enter name in camel case format",
                message: 'Name must be in CamelCase format',
                required: true
            },
            css: {
                type: 'boolean',
                description: 'Add CSS module file? (t/f)',
                required: true
            },
            path: {
                description: "Enter the path for the component (must exist)",
                required: true,
                default: './'
            }
        }
    }


    const {name, css, path} =  await prompt.get(schema);


    let templatePath;
    if(css){
        templatePath = `${__dirname}/../templates/componentWithCss`;
    }else{
        templatePath = `${__dirname}/../templates/component`;
    }


    /**
     * Copy template
     */
    if (fs.existsSync(templatePath)) {
        logger.info('Copying files…');
        const componentPath = `${localPath}/${path}/${name}`;

        await shell.mkdir('-p', componentPath);
        await shell.cp('-R', `${templatePath}/*`, `${componentPath}/`);

        await shell.mv(`${componentPath}/template.tsx`, `${componentPath}/${name}.tsx`);

        if(css){
            await shell.mv(`${componentPath}/style.module.scss`, `${componentPath}/${name}.module.scss`);
        }

        shell.ls('-Rl', componentPath).forEach(entry => {
            if(entry.isFile()){
                shell.sed('-i', `\\[NAME\\]`, name, `${componentPath}/${entry.name}`);
            }
        });

        logger.info('✔ The files have been copied!');
    } else {
        logger.error(`Some problem happened...`)
        process.exit(1);
    }


    console.log(name);


};