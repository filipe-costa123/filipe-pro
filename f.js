// script.js
function calcularSubrede() {
    const ip = document.getElementById("ip").value.trim();
    const mask = document.getElementById("mask").value.trim();

    if (!validarIP(ip) || !validarIP(mask)) {
        alert("Por favor, insira um IP e uma máscara válidos.");
        return;
    }

    const ipBin = ipParaBinario(ip);
    const maskBin = ipParaBinario(mask);

    const redeBin = andBin(ipBin, maskBin);
    const broadcastBin = orBin(ipBin, inverterMascara(maskBin));

    const rede = binarioParaIP(redeBin);
    const broadcast = binarioParaIP(broadcastBin);
    
    const primeiroIP = incrementarIP(rede);
    const ultimoIP = decrementarIP(broadcast);

    const cidr = calcularCIDR(mask);
    const quantidadeHosts = calcularHosts(mask);
    const numeroSubredes = calcularSubRedes(mask);

    document.getElementById("rede").innerText = rede;
    document.getElementById("broadcast").innerText = broadcast;
    document.getElementById("ip_valido_1").innerText = primeiroIP;
    document.getElementById("ip_valido_2").innerText = ultimoIP;
    document.getElementById("hosts").innerText = quantidadeHosts;
    document.getElementById("cidr").innerText = cidr;
    document.getElementById("subredes").innerText = numeroSubredes;
}

function validarIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}

function ipParaBinario(ip) {
    return ip.split('.').map(octeto => ("00000000" + (parseInt(octeto).toString(2))).slice(-8)).join('');
}

function andBin(bin1, bin2) {
    return bin1.split('').map((bit, index) => bit === '1' && bin2[index] === '1' ? '1' : '0').join('');
}

function orBin(bin1, bin2) {
    return bin1.split('').map((bit, index) => bit === '1' || bin2[index] === '1' ? '1' : '0').join('');
}

function inverterMascara(maskBin) {
    return maskBin.split('').map(bit => bit === '1' ? '0' : '1').join('');
}

function binarioParaIP(bin) {
    return bin.match(/.{8}/g).map(byte => parseInt(byte, 2)).join('.');
}

function incrementarIP(ip) {
    const partes = ip.split('.').map(Number);
    partes[3]++;
    if (partes[3] > 255) {
        partes[3] = 0;
        partes[2]++;
    }
    return partes.join('.');
}

function decrementarIP(ip) {
    const partes = ip.split('.').map(Number);
    partes[3]--;
    if (partes[3] < 0) {
        partes[3] = 255;
        partes[2]--;
    }
    return partes.join('.');
}

function calcularCIDR(mask) {
    const maskBin = ipParaBinario(mask);
    return maskBin.split('1').length - 1;
}

function calcularHosts(mask) {
    const maskBin = ipParaBinario(mask);
    const zeros = maskBin.split('0').length - 1;
    return Math.pow(2, zeros) - 2;  // Subtraímos 2 para excluir o endereço de rede e o endereço de broadcast
}

function calcularSubRedes(mask) {
    const maskBin = ipParaBinario(mask);
    const zeros = maskBin.split('0').length - 1;
    return Math.pow(2, zeros);
}
