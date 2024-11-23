const os = require('os');

const getLocalIPv4Address = () => {
    const interfaces = os.networkInterfaces();
    console.log("interface------------->",interfaces);
    for (const ifaceName in interfaces) {
        const iface = interfaces[ifaceName];
        for (const { address, family, internal } of iface) {
            if (family === 'IPv4' && !internal) {
                console.log("check type", typeof address)
                return address;
            }
        }
    }
}

module.exports = { getLocalIPv4Address };
