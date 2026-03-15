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

public class JwtTokenGenerator {
    public static void main(String[] args) throws Exception {
        // Đọc Private Key (PKCS8) bạn lấy từ Web
        String key = new String(Files.readAllBytes(Paths.get("src/main/resources/certs/private.pem")))
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] keyBytes = Base64.getDecoder().decode(key);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        PrivateKey privateKey = KeyFactory.getInstance("RSA").generatePrivate(spec);

        // Tạo nội dung Token (Payload)
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject("user123")
                .issuer("self")
                .expirationTime(new Date(new Date().getTime() + 3600 * 1000)) // Hết hạn sau 1h
                .build();

        // Ký bằng RSA
        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.RS256), claimsSet);
        signedJWT.sign(new RSASSASigner(privateKey));

        System.out.println("Access Token của bạn là:\n" + signedJWT.serialize());
    }
}