/* global encodePrivateKey, encodePublicKey */
const extractable = true;

function wrap(text, len) {
  const length = len || 72;
  let result = "";
  for (let i = 0; i < text.length; i += length) {
    result += text.slice(i, i + length);
    result += "\n";
  }
  return result;
}

function rsaPrivateKey(key) {
  return `-----BEGIN RSA PRIVATE KEY-----\n${key}-----END RSA PRIVATE KEY-----`;
}

function generateKeyPair(alg, size, name) {
  return window.crypto.subtle
    .generateKey(
      {
        name: alg,
        modulusLength: size, // can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" }, // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      extractable,
      ["sign", "verify"]
    )
    .then(key => {
      const privateKey = window.crypto.subtle
        .exportKey("jwk", key.privateKey)
        .then(encodePrivateKey)
        .then(wrap)
        .then(rsaPrivateKey);

      const publicKey = window.crypto.subtle.exportKey("jwk", key.publicKey).then(jwk => encodePublicKey(jwk, name));
      return Promise.all([privateKey, publicKey]);
    });
}

module.exports = { generateKeyPair };
