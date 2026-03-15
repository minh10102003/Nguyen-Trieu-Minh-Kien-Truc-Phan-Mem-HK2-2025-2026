package iuh.fit.se.jwt;


import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

public class generateToken {
    public String generateToken(String username, long expirationTimeInSeconds) throws Exception {
        // 1. Đọc Private Key từ file pem
        String privateKeyPEM = new String(Files.readAllBytes(Paths.get("src/main/resources/certs/private.pem")));
        privateKeyPEM = privateKeyPEM.replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] encoded = Base64.getDecoder().decode(privateKeyPEM);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        PrivateKey privateKey = kf.generatePrivate(new PKCS8EncodedKeySpec(encoded));

        // 2. Tạo Payload (Claims)
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("my-auth-server")
                .expirationTime(new Date(new Date().getTime() + expirationTimeInSeconds * 1000))
                .build();

        // 3. Ký Token bằng RSA Private Key
        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.RS256), claimsSet);
        signedJWT.sign(new RSASSASigner(privateKey));

        return signedJWT.serialize();
    }
}