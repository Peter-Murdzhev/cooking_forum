package com.example.cooking_forum.file;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {

    public void uploadImageToFileSystem(MultipartFile file)throws IOException{
        //this path won't work in production. Only when the project is launched
        //from IDE or the command prompt
        String filePath = System.getProperty("user.dir").replace("\\", "/") +
                "/images/recipes_pics/" +
                file.getOriginalFilename();

        file.transferTo(new File(filePath));
    }

    public byte[] downloadImageFromFileSystem(String filename) throws IOException {
       String filePath = System.getProperty("user.dir").replace("\\", "/") +
               "/images/recipes_pics/" + filename;

       return Files.readAllBytes(new File(filePath).toPath());
    }

    public void replaceImage(String oldImageName, MultipartFile newImage) throws IOException {
        String mainDir = System.getProperty("user.dir").replace("\\", "/") +
                "/images/recipes_pics/";

        String archiveDir = mainDir + "archive/";

        //move the old file
        File oldFile = new File(mainDir + oldImageName);
        if(oldFile.exists()){
            Files.move(oldFile.toPath(), Paths.get(archiveDir + oldImageName),
                    StandardCopyOption.REPLACE_EXISTING);
        }

        //save the new file
        File file = new File(mainDir + newImage.getOriginalFilename());
        newImage.transferTo(file);
    }
}
