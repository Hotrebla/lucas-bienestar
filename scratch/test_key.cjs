const { webcrypto } = require('crypto');
const jose = require('crypto');

const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUKWWAm2jNEhqx\npJny+4pd0pcEvzpwu4ZJPy8Xq1n3PuPwEGVE42qaT4DIDeVgzOrLj33BG2sAGxYa\nBtMV/icTSa96SmM3h0uBb8OVbMxcXh3q7qM/H4n/WLthC+TpMTeSDvBns6hp0Iyc\nUQf7xblOpOoRFmHo9Gb8E+zkph4BWmUcOL3CWiTi4ijMQcjQdk0+S5SqXgNhYom+\npRyXLoodE/ig9md4PJnFhFXaXgVe+N5OtEnfEtbo+BzcGusyAvgyNdrYMmsl52wf\n1/oMIeNl81LL8sVQ7WZnu/BSiilNd6rFgsXm/gSPPlpTGTm9fDwPlwkwPsvm+rFn\nFBIyacuBAgMBAAECggEALkhYkvl0H5ZlOd8LUYEzslt8I+Y2kLyr4wM0WgDAp8nx\nrh9ZhDFrQj35PUsgwKD7UIxdNdjuGvANvoBCILBYpGHE9NPQ+J5cZ6ByxYBeRYEn\nnCZSePT/pPNdryJJ3eAlfAijw6+i2/CJmBkqOW+tCN27jR45njjg1XlgSpH9hjQk\n0FVPUZwCKJa4SJfFNwMtSDx80N11PW0cYhdhkU/Yzi7drAU/pqxUtqG6t2s20FIM\nx6EVWktapwqbPU4IldZnqv4vE8WsE5qw5d+PR8nkj2Ppa+esHKW9QbUv9mZ5H/Io\nEgr3uW6t5VB7v6kKqBA0s0XQF3PLAjsGW06Je/eYRQKBgQD794NmaE5/K7blD7IM\nTQQR5+Bu7OF6O1K4vC8tHVhcDvIsaYpKNdw5hg/CtR8spMD+Yo51DYAQzL1434Gv\nYrjBJUkEYqsmZahzZtUlxYMBWv8oWcmA8gnalKFxtRy2H7nFSr5F1PvEp0M0NmWw\nGwUD9WEkf6+XohVWqsygLDGrHQKBgQDXjsX5K9Uwm4BtubRYMY3mhsz3xxaVyJb8\nDEXj7pPScBEVvJ1CWU0Y9/PdDhXJvmpL8niaWAExdalIQCLAIAwBIwhwV0xeciJt\n2asODYYSfMHFsz50SUvzJzJDEQEJXRbwYqSPUbmiXin2osS/rZQ1gHxf2j4XBgEe\n8Np+neIQtQKBgQDC6Ix0w2s1ZJNuTd3lNg5X647pP8SL0SgET04PEAwx6j3brSiU\nj2Vz+ghnDcS3vBqurX6VfYP7euV2gy7GhQ92GWmKQukyIqFT49AuD8NvYPzQMeR2\nIsUMmLzqQLedCp2hyFe3nTHExb5uvUWcHMqcbUxf94XVPkRTbnwrywQA4QKBgG+k\nU6bs69rj/w1VbDFtYPgvgwMlyu3C2WgrlxspWshYIJEogi51//dZnKU2AVTe2UEC\nkTInOF78eLOh/B2Tu4PvOBSvMi+MX4aTgQOjP3hdwyJ45nTl7X8/IsoXiXjnDNVt\n0ZslEccljAhgXxSDe0qGhGRErXnRM01qI1AGx6otAoGBAIkZaPSki/q+3/LdGE+X\nzGWBeKxpFgLx2o+gXTAuHm3WNn2Mw4/GEDbY/8F30gFvaKD7k00lNTU1ncLAeJLm\nztgiqkhSJ/43BVNOnTgDNRJSn7rvFIKSqAK1VG1D92q9+THYEKlPtnWAC2FMswpi\nrefyshT9OA/V/c0XPflkMqXz\n-----END PRIVATE KEY-----\n";

async function testWebCrypto() {
  try {
    const cleanKey = privateKey.replace(/\\n/g, '\n');
    const match = cleanKey.match(/-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/);
    const pemContents = match[1].replace(/[^A-Za-z0-9+/=]/g, '');
    const binaryDerString = atob(pemContents);
    let binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    
    // Slice to 1218 if larger
    if (binaryDer.length > 1218) {
      binaryDer = binaryDer.subarray(0, 1218);
    }

    const cryptoKey = await webcrypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );
    console.log("importKey with 1218 slice SUCCESS!");

    // Now test fetching OAuth2 token with this key
    const client_email = 'saas-vertex-master@project-3b329dc7-de06-42c5-9f3.iam.gserviceaccount.com';
    const jwtHeader = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: client_email,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };
    
    const headerBase64 = Buffer.from(JSON.stringify(jwtHeader)).toString('base64url');
    const payloadBase64 = Buffer.from(JSON.stringify(jwtPayload)).toString('base64url');
    const sign = jose.createSign('RSA-SHA256');
    sign.update(`${headerBase64}.${payloadBase64}`);
    const signatureBase64 = sign.sign(cleanKey, 'base64url');
    const assertion = `${headerBase64}.${payloadBase64}.${signatureBase64}`;
    
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
    });
    
    const tokenData = await res.json();
    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);
    console.log("Google OAuth2 Token SUCCESS! Access token acquired:", tokenData.access_token.substring(0, 30) + '...');
  } catch (err) {
    console.error("Test FAILED:", err.message);
  }
}

testWebCrypto();
