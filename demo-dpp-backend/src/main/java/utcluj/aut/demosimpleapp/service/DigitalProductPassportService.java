package utcluj.aut.demosimpleapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utcluj.aut.demosimpleapp.model.DigitalProductPassport;
import utcluj.aut.demosimpleapp.model.RepairEntry;
import utcluj.aut.demosimpleapp.repository.DigitalProductPassportRepository;

import java.util.List;

@Service
public class DigitalProductPassportService {

    @Autowired
    private DigitalProductPassportRepository passportRepository;

    public DigitalProductPassport getPassportById(Long id) {
        return passportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passport not found with id: " + id));
    }

    public DigitalProductPassport getPassportBySerialNumber(String serialNumber) {
        DigitalProductPassport passport = passportRepository.findBySerialNumber(serialNumber);
        if (passport == null) {
            throw new RuntimeException("Passport not found with serial number: " + serialNumber);
        }
        return passport;
    }

    public List<DigitalProductPassport> getAllPassports() {
        return passportRepository.findAll();
    }

    public DigitalProductPassport createPassport(DigitalProductPassport passport) {
        return passportRepository.save(passport);
    }

    public RepairEntry addRepairEntry(Long passportId, RepairEntry repairEntry) {
        DigitalProductPassport passport = getPassportById(passportId);
        repairEntry.setPassport(passport);
        passport.getRepairHistory().add(repairEntry);
        passportRepository.save(passport);
        return repairEntry;
    }
} 