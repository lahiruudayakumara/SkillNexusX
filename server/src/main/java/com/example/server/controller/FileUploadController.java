package com.example.server.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FileUploadController {
    @Value("${storage.key-id}")
    private String KEY_ID;

    @Value("${storage.app-key}")
    private String APP_KEY;

    @Value("${storage.bucket-id}")
    private String BUCKET_ID;

    @Value("${storage.bucket-name}")
    private String BUCKET_NAME;

    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/upload")
    public ResponseEntity<?> uploadToBackblaze(@RequestParam("file") MultipartFile file) {
        try {
            // Check for file existence and validity
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded or file is empty."));
            }

            // 1. Authorize
            String credentials = Base64.getEncoder().encodeToString((KEY_ID + ":" + APP_KEY).getBytes());
            HttpURLConnection authConn = (HttpURLConnection) new URL("https://api.backblazeb2.com/b2api/v2/b2_authorize_account").openConnection();
            authConn.setRequestProperty("Authorization", "Basic " + credentials);

            JsonNode authJson = mapper.readTree(readResponse(authConn));

            // Ensure keys exist before accessing
            if (!authJson.has("apiUrl") || !authJson.has("authorizationToken")) {
                return ResponseEntity.status(500).body(Map.of("error", "Missing API URL or Authorization Token in the response."));
            }

            String apiUrl = authJson.get("apiUrl").asText();
            String authToken = authJson.get("authorizationToken").asText();

            // 2. Get Upload URL
            HttpURLConnection uploadUrlConn = (HttpURLConnection) new URL(apiUrl + "/b2api/v2/b2_get_upload_url").openConnection();
            uploadUrlConn.setDoOutput(true);
            uploadUrlConn.setRequestMethod("POST");
            uploadUrlConn.setRequestProperty("Authorization", authToken);

            String body = "{\"bucketId\":\"" + BUCKET_ID + "\"}";
            try (OutputStream os = uploadUrlConn.getOutputStream()) {
                os.write(body.getBytes());
            }

            JsonNode uploadJson = mapper.readTree(readResponse(uploadUrlConn));

            // Ensure keys exist before accessing
            if (!uploadJson.has("uploadUrl") || !uploadJson.has("authorizationToken")) {
                return ResponseEntity.status(500).body(Map.of("error", "Missing Upload URL or Authorization Token in the response."));
            }

            String finalUploadUrl = uploadJson.get("uploadUrl").asText();
            String uploadAuthToken = uploadJson.get("authorizationToken").asText();

            // 3. Upload the file
            HttpURLConnection fileUploadConn = (HttpURLConnection) new URL(finalUploadUrl).openConnection();
            fileUploadConn.setDoOutput(true);
            fileUploadConn.setRequestMethod("POST");
            fileUploadConn.setRequestProperty("Authorization", uploadAuthToken);
            fileUploadConn.setRequestProperty("X-Bz-File-Name", file.getOriginalFilename());
            fileUploadConn.setRequestProperty("Content-Type", "b2/x-auto");
            fileUploadConn.setRequestProperty("X-Bz-Content-Sha1", "do_not_verify");
            fileUploadConn.setRequestProperty("Content-Length", String.valueOf(file.getSize()));

            try (OutputStream os = fileUploadConn.getOutputStream()) {
                os.write(file.getBytes());
            }

            JsonNode uploadedFileJson = mapper.readTree(readResponse(fileUploadConn));

            // Ensure 'fileName' exists
            if (!uploadedFileJson.has("fileName")) {
                return ResponseEntity.status(500).body(Map.of("error", "'fileName' is missing in the response."));
            }

            String fileName = uploadedFileJson.get("fileName").asText();
            String fileUrl = "https://f000.backblazeb2.com/file/" + BUCKET_NAME + "/" + fileName;

            String downloadUrl = apiUrl + "/file/" + BUCKET_NAME + "/" + fileName;
            String previewUrl = downloadUrl + "?Authorization=" + authToken;

            return ResponseEntity.ok(Map.of("url", previewUrl));

        } catch (Exception e) {
            e.printStackTrace(); // for debugging in console
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload-video")
    public ResponseEntity<?> uploadVideoToBackblaze(@RequestParam("file") MultipartFile file) {
        try {
            // Optional: Validate video file type (e.g., .mp4, .webm, etc.)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid video file type."));
            }

            // 1. Authorize
            String credentials = Base64.getEncoder().encodeToString((KEY_ID + ":" + APP_KEY).getBytes());
            HttpURLConnection authConn = (HttpURLConnection) new URL("https://api.backblazeb2.com/b2api/v2/b2_authorize_account").openConnection();
            authConn.setRequestProperty("Authorization", "Basic " + credentials);

            JsonNode authJson = mapper.readTree(readResponse(authConn));
            String apiUrl = authJson.get("apiUrl").asText();
            String authToken = authJson.get("authorizationToken").asText();

            // 2. Get Upload URL
            HttpURLConnection uploadUrlConn = (HttpURLConnection) new URL(apiUrl + "/b2api/v2/b2_get_upload_url").openConnection();
            uploadUrlConn.setDoOutput(true);
            uploadUrlConn.setRequestMethod("POST");
            uploadUrlConn.setRequestProperty("Authorization", authToken);

            String body = "{\"bucketId\":\"" + BUCKET_ID + "\"}";
            try (OutputStream os = uploadUrlConn.getOutputStream()) {
                os.write(body.getBytes());
            }

            JsonNode uploadJson = mapper.readTree(readResponse(uploadUrlConn));
            String finalUploadUrl = uploadJson.get("uploadUrl").asText();
            String uploadAuthToken = uploadJson.get("authorizationToken").asText();

            // 3. Upload the video file
            HttpURLConnection fileUploadConn = (HttpURLConnection) new URL(finalUploadUrl).openConnection();
            fileUploadConn.setDoOutput(true);
            fileUploadConn.setRequestMethod("POST");
            fileUploadConn.setRequestProperty("Authorization", uploadAuthToken);

            // Percent-encode the file name to handle special characters or spaces
            String encodedFileName = URLEncoder.encode(file.getOriginalFilename(), StandardCharsets.UTF_8.toString());
            fileUploadConn.setRequestProperty("X-Bz-File-Name", encodedFileName);

            fileUploadConn.setRequestProperty("Content-Type", contentType);
            fileUploadConn.setRequestProperty("X-Bz-Content-Sha1", "do_not_verify");
            fileUploadConn.setRequestProperty("Content-Length", String.valueOf(file.getSize()));

            try (OutputStream os = fileUploadConn.getOutputStream()) {
                os.write(file.getBytes());
            }

            // Log the response for debugging
            String response = readResponse(fileUploadConn);
            System.out.println("Upload response: " + response);

            JsonNode uploadedFileJson = mapper.readTree(response);

            // Check for 'fileName' in the response
            if (!uploadedFileJson.has("fileName")) {
                return ResponseEntity.status(500).body(Map.of("error", "'fileName' is missing in the response."));
            }

            String fileName = uploadedFileJson.get("fileName").asText();
            String fileUrl = "https://f000.backblazeb2.com/file/" + BUCKET_NAME + "/" + fileName;
            String downloadUrl = apiUrl + "/file/" + BUCKET_NAME + "/" + fileName;
            String previewUrl = downloadUrl + "?Authorization=" + authToken;

            return ResponseEntity.ok(Map.of("url", previewUrl));

        } catch (Exception e) {
            e.printStackTrace(); // for debugging in console
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }


    private String readResponse(HttpURLConnection conn) throws IOException {
        InputStream stream = conn.getResponseCode() < 400 ? conn.getInputStream() : conn.getErrorStream();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            return response.toString();
        }
    }
}
