package utcluj.aut.demosimpleapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utcluj.aut.demosimpleapp.model.DigitalProductPassport;
import utcluj.aut.demosimpleapp.model.RepairEntry;
import utcluj.aut.demosimpleapp.service.DigitalProductPassportService;

import java.util.List;

@RestController
@RequestMapping("/api/dpp")
public class DigitalProductPassportController {

    @Autowired
    private DigitalProductPassportService passportService;

    @GetMapping("/{id}")
    public ResponseEntity<DigitalProductPassport> getPassportById(@PathVariable Long id) {
        return ResponseEntity.ok(passportService.getPassportById(id));
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseEntity<DigitalProductPassport> getPassportBySerialNumber(@PathVariable String serialNumber) {
        return ResponseEntity.ok(passportService.getPassportBySerialNumber(serialNumber));
    }

    @GetMapping
    public ResponseEntity<List<DigitalProductPassport>> getAllPassports() {
        return ResponseEntity.ok(passportService.getAllPassports());
    }

    @PostMapping
    public ResponseEntity<DigitalProductPassport> createPassport(@RequestBody DigitalProductPassport passport) {
        return ResponseEntity.ok(passportService.createPassport(passport));
    }

    @PostMapping("/{passportId}/repairs")
    public ResponseEntity<RepairEntry> addRepairEntry(
            @PathVariable Long passportId,
            @RequestBody RepairEntry repairEntry) {
        return ResponseEntity.ok(passportService.addRepairEntry(passportId, repairEntry));
    }
} 