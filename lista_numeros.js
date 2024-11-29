const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

let estadoUsuario = 'inicio';

const respostas = {
    inicio: 'Olá! Bem-vindo(a) ao nosso serviço de IPTV.  Escolha uma opção:\n\n1. Pacotes disponíveis\n2. Canais disponíveis\n3. Testar o serviço\n4. Suporte técnico\n5. Assinar agora\n6. Sair',
    pacotes: 'Oferecemos os seguintes pacotes:\n\n* **Básico:** R$29,90 - 50 canais, resolução SD\n* **Premium:** R$49,90 - 150 canais, resolução HD\n* **Premium Plus:** R$69,90 - 250 canais, resolução 4K + canais adultos\n\nDigite o número do pacote para mais detalhes ou "menu" para voltar.',
    canais: 'Temos uma ampla variedade de canais, incluindo:\n\n* Globo, Record, SBT, Band\n* ESPN, SporTV\n* HBO, Telecine\n* Discovery, NatGeo\n\nPara ver a lista completa, acesse nosso site: https://www.exemploiptv.com.br\n\nDigite "menu" para voltar.',
    testar: 'Para testar nosso serviço gratuitamente por 24 horas, acesse: https://www.exemploiptv.com.br/teste\n\nDigite "menu" para voltar.',
    suporte: 'Para suporte técnico, entre em contato através de:\n\n* WhatsApp: https://wa.me/5511999999999\n* Email: suporte@exemploiptv.com.br\n\nDigite "menu" para voltar.',
    assinar: 'Para assinar agora, acesse: https://www.exemploiptv.com.br/assinatura\n\nDigite "menu" para voltar.',
    default: 'Opção inválida. Digite "menu" para voltar ao menu principal.'
};

client.on('message', async msg => {
    try {
        const mensagem = msg.body.toLowerCase();
        const chatId = msg.from;

        if (mensagem === 'menu' || estadoUsuario !== 'inicio') {
            estadoUsuario = 'inicio';
            await client.sendMessage(chatId, respostas.inicio);
            return;
        }

        switch (estadoUsuario) {
            case 'inicio':
                if (mensagem === '1') estadoUsuario = 'pacotes';
                else if (mensagem === '2') estadoUsuario = 'canais';
                else if (mensagem === '3') estadoUsuario = 'testar';
                else if (mensagem === '4') estadoUsuario = 'suporte';
                else if (mensagem === '5') estadoUsuario = 'assinar';
                else if (mensagem === '6') await client.sendMessage(chatId, 'Obrigado por entrar em contato conosco! Até breve!');
                else await client.sendMessage(chatId, respostas.default);
                break;
            case 'pacotes':
            case 'canais':
            case 'testar':
            case 'suporte':
            case 'assinar':
                await client.sendMessage(chatId, respostas[estadoUsuario]);
                break;
        }

        await delay(1000);

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
});
