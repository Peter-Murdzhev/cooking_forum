package com.example.cooking_forum.file;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/image")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<String> saveImage(@RequestParam("image") MultipartFile file) throws IOException {
        fileService.uploadImageToFileSystem(file);

        return ResponseEntity.ok("/images/recipes_pics/" + file.getOriginalFilename());
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<?> downloadImage(@PathVariable String filename) throws IOException {
        byte[] image = fileService.downloadImageFromFileSystem(filename);

        return ResponseEntity.ok(image);
    }

    @PostMapping("/replace/{oldFilename}")
    public ResponseEntity<?> replaceImage(@PathVariable String oldFilename,
                                          @RequestParam("image") MultipartFile newImage) throws IOException {
        fileService.replaceImage(oldFilename, newImage);

        return ResponseEntity.ok("/images/recipes_pics/" + newImage.getOriginalFilename());
    }
}
