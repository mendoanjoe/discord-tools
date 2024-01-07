const { SlashCommandBuilder } = require('discord.js');
const { debrid: { token, proxy_site } } = require('../../../config.json');
const SITE_URL = 'https://debrid-link.fr/api/v2/downloader/add'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('download')
        .setDescription('Downloads a file using the debrid-link API.')
        .addStringOption((option) =>
            option.setName('url').setDescription('The URL of the file to download.').setRequired(true)
        ),
    async execute(interaction) {
        try {
            const url = interaction.options.getString('url');

            const response = await fetch(SITE_URL, {
                headers: {
                    'accept': 'application/json',
                    'authorization': `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                referrer: 'https://debrid-link.fr/api_doc/v2/downloader-add',
                referrerPolicy: 'strict-origin-when-cross-origin',
                body: JSON.stringify({ url }),
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const downloadInfo = data.value;
                const message = `
		🚀 Premium Download Ready!
		⭐ Requested by: ${interaction.user}
		
		File Name: ${downloadInfo.name}
		File Size: ${formatBytes(downloadInfo.size)}
		
		Direct Download:
        ${proxy_site}/${downloadInfo.downloadUrl}
		Create a Mirror: Use \/mirror [put-direct-download-link]`
                await interaction.reply(message);

            } else {
                throw new Error('Failed to initiate download. Please check the provided URL.');
            }
        } catch (error) {
            // console.error('Error:', error);
            await interaction.reply(`An error occurred: ${error.message}`);
        }
    },
};

function formatBytes(bytes) {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
    return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
}

