const { SlashCommandBuilder } = require('discord.js');
const request = require('request-promise');

const { mirorace: { api_key, api_token } } = require('../../../config.json');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mirrorace')
        .setDescription('Initiate a remote upload on MirrorAce.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the file to download.')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const userUrl = interaction.options.getString('url');

            // STEP 2: Get cTracker, upload_key, and mirrors[] from the MirrorAce API

            const options = {
                method: 'POST',
                url: 'https://mirrorace.com/api/v1/file/upload',
                formData: {
                    api_key: api_key,
                    api_token: api_token,
                },
            };

            await interaction.deferReply();

            await wait(2_000);

            const body = await request(options);

            // Add your processing logic for the response body here
            const data = JSON.parse(body);

            if (data.status !== 'success') {
                throw new Error(`Error while requesting account information. Error: ${data.result}`);
            }

            // Continue with the variables from the response
            const dataResult = data.result;

            const remoteUploadOptions = {
                method: 'POST',
                url: dataResult.server_remote,
                formData: {
                    api_key: api_key,
                    api_token: api_token,
                    cTracker: dataResult.cTracker,
                    upload_key: dataResult.upload_key,
                    url: userUrl,
                    file_password: '',
                    'mirrors[]': dataResult.default_mirrors.join(','),
                },
            };

            const remoteUploadBody = await request(remoteUploadOptions);

            // Add your processing logic for the response body here
            const remoteUploadData = JSON.parse(remoteUploadBody);

            if (remoteUploadData.status !== 'success') {
                throw new Error(`Error while initiating remote upload. Error: ${remoteUploadData.result}`);
            }

            // Continue with the variables from the response
            const remoteUploadResult = remoteUploadData.result.url;

            interaction.editReply(remoteUploadResult);
        } catch (error) {
            console.error('Error:', error);
            await interaction.reply(`An error occurred: ${error.message}`);
        }
    },
};
