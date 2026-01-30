package com.example.demo.controller;

import java.util.List;

import org.apache.tika.Tika;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Job;

@RestController
@RequestMapping("/recommendations")
//@CrossOrigin(origins = "*")
public class RecommendationController {

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public List<Job> recommendJobs(@RequestParam("resume") MultipartFile file) throws Exception {

        if (file.isEmpty()) {
            throw new RuntimeException("Resume file is empty");
        }

        // ✅ Proper resume text extraction
        Tika tika = new Tika();
        String resumeText = tika.parseToString(file.getInputStream()).toLowerCase();

        System.out.println("=== EXTRACTED RESUME TEXT ===");
        System.out.println(resumeText);

        List<Job> jobs = List.of(
            new Job(1, "Java Developer", "XYZ Solutions", "java spring mysql"),
            new Job(2, "Python Developer", "ABC Corp", "python django flask"),
            new Job(3, "Frontend Developer", "WebWorks", "html css javascript"),
            new Job(4, "AI Engineer", "NextGen AI", "machine learning python"),
            new Job(5, "DevOps Engineer", "CloudNet", "aws docker kubernetes")
        );

        return jobs.stream()
            .filter(j ->
                resumeText.contains("java") && j.getSkills().toLowerCase().contains("java") ||
                resumeText.contains("python") && j.getSkills().toLowerCase().contains("python") ||
                resumeText.contains("html") && j.getSkills().toLowerCase().contains("html") ||
                resumeText.contains("aws") && j.getSkills().toLowerCase().contains("aws")
            )
            .toList();
    }
}
