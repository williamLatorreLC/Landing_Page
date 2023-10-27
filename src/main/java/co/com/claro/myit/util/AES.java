/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.util;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 *
 * @author JD
 */
public class AES {

    private static final String encryptionKey = "LandingMyITPageK";
    private static final String characterEncoding = "UTF-8";
    private static final String cipherTransformation = "AES/ECB/PKCS5Padding";
    private static final String aesEncryptionAlgorithem = "AES";

    private static final String encryptionServiceKey = "Inc0mProd1UZRr";
    private static final String encryptionServiceSha = "SHA-1";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    private static final String AES_GCM_NO_PADDING = "AES/GCM/NoPadding";

    public static SecretKeySpec getSecretKey() throws NoSuchAlgorithmException {
        MessageDigest sha;
        byte[] key = encryptionServiceKey.getBytes(StandardCharsets.UTF_8);
        sha = MessageDigest.getInstance(encryptionServiceSha);
        key = sha.digest(key);
        key = Arrays.copyOf(key, GCM_TAG_LENGTH);
        return new SecretKeySpec(key, aesEncryptionAlgorithem);
    }

    /**
     * Method for Encrypt Plain String Data
     *
     * @param plainText
     * @return encryptedText
     */
    public static String encrypt(String plainText) {
        String encryptedText = "";
        try {
            Cipher cipher = Cipher.getInstance(cipherTransformation);
            byte[] key = encryptionKey.getBytes(characterEncoding);
            SecretKeySpec secretKey = new SecretKeySpec(key, aesEncryptionAlgorithem);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] cipherText = cipher.doFinal(plainText.getBytes("UTF8"));
            Base64.Encoder encoder = Base64.getEncoder();
            encryptedText = encoder.encodeToString(cipherText);

        } catch (UnsupportedEncodingException | InvalidKeyException | NoSuchAlgorithmException | BadPaddingException | IllegalBlockSizeException | NoSuchPaddingException E) {
            System.err.println("Encrypt Exception : " + E.getMessage());
        }
        return encryptedText;
    }

    /**
     * Method For Get encryptedText and Decrypted provided String
     *
     * @param encryptedText
     * @return decryptedText
     */
    public static String decrypt(String encryptedText) {
        String decryptedText = "";
        try {
            Cipher cipher = Cipher.getInstance(cipherTransformation);
            byte[] key = encryptionKey.getBytes(characterEncoding);
            SecretKeySpec secretKey = new SecretKeySpec(key, aesEncryptionAlgorithem);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            Base64.Decoder decoder = Base64.getDecoder();
            byte[] cipherText = decoder.decode(encryptedText.getBytes("UTF8"));
            decryptedText = new String(cipher.doFinal(cipherText), "UTF-8");

        } catch (UnsupportedEncodingException | InvalidKeyException | NoSuchAlgorithmException | BadPaddingException | IllegalBlockSizeException | NoSuchPaddingException E) {
            System.err.println("decrypt Exception : " + E.getMessage());
        }
        return decryptedText;
    }

    /**
     * Metodo que se encarga de obtener encriptar la informacion
     *
     * @author dado por ingeniero de gestion
     * @param privateString informacion a encriptar
     * @return informacion encriptada
     * @throws javax.crypto.BadPaddingException
     * @throws javax.crypto.IllegalBlockSizeException
     * @throws javax.crypto.NoSuchPaddingException
     * @throws java.security.NoSuchAlgorithmException
     * @throws java.security.InvalidAlgorithmParameterException
     * @throws java.security.InvalidKeyException
     */
    public static String encryptMethod(String privateString) throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException {
        SecretKeySpec sKey = getSecretKey();
        byte[] iv = new byte[GCM_IV_LENGTH];
        (new SecureRandom()).nextBytes(iv);

        Cipher cipher = Cipher.getInstance(AES_GCM_NO_PADDING);
        GCMParameterSpec ivSpec = new GCMParameterSpec(GCM_TAG_LENGTH * Byte.SIZE, iv);
        cipher.init(Cipher.ENCRYPT_MODE, sKey, ivSpec);

        byte[] cipherText = cipher.doFinal(privateString.getBytes(StandardCharsets.UTF_8));
        byte[] encrypted = new byte[iv.length + cipherText.length];
        System.arraycopy(iv, 0, encrypted, 0, iv.length);
        System.arraycopy(cipherText, 0, encrypted, iv.length, cipherText.length);

        return Base64.getEncoder().encodeToString(encrypted);
    }

    /**
     * Metodo que se encarga de desencriptar la informacion
     *
     * @author
     * @param encrypted informacion a desencriptar
     * @return informacion desencriptada
     * @throws javax.crypto.BadPaddingException
     * @throws javax.crypto.IllegalBlockSizeException
     * @throws javax.crypto.NoSuchPaddingException
     * @throws java.security.NoSuchAlgorithmException
     * @throws java.security.InvalidAlgorithmParameterException
     * @throws java.security.InvalidKeyException
     */
    public static String decryptMethod(String encrypted) throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException {
        byte[] cipherText = null;

        SecretKeySpec sKey = getSecretKey();
        byte[] decoded = Base64.getDecoder().decode(encrypted);
        byte[] iv = Arrays.copyOfRange(decoded, 0, GCM_IV_LENGTH);

        Cipher cipher = Cipher.getInstance(AES_GCM_NO_PADDING);
        GCMParameterSpec ivSpec = new GCMParameterSpec(GCM_TAG_LENGTH * Byte.SIZE, iv);
        cipher.init(Cipher.DECRYPT_MODE, sKey, ivSpec);

        cipherText = cipher.doFinal(decoded, GCM_IV_LENGTH, decoded.length - GCM_IV_LENGTH);

        return new String(cipherText, StandardCharsets.UTF_8);
    }
}
