// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract HBVTracker {
    struct VaccinationRecord {
        bytes32 dataHash;
        uint256 timestamp;
    }

    address public deployer;
    mapping(address => VaccinationRecord[]) private vaccinationRecords;
    mapping(address => bool) public authorizedHealthcareProviders;
    mapping(address => bool) public authorizedResearchers;

    event VaccinationStored(address indexed patient, bytes32 dataHash);
    event ResearcherAuthorized(address indexed researcher);
    event HealthcareProviderAuthorized(address indexed provider);

    constructor() {
        deployer = msg.sender;
    }

    // Add an admin-controlled function to authorize healthcare providers
    function authorizeHealthcareProvider(address provider) public {
        require(msg.sender == deployer, "Only admin can authorize providers");
        authorizedHealthcareProviders[provider] = true;
        emit HealthcareProviderAuthorized(provider);
    }

    // Store vaccination hash (Multiple records per patient)
    function storeHash(address patient, bytes32 dataHash) public {
        require(
            authorizedHealthcareProviders[msg.sender],
            "Not an authorized healthcare provider"
        );

        vaccinationRecords[patient].push(VaccinationRecord(dataHash, block.timestamp));
        emit VaccinationStored(patient, dataHash);
    }

    // Retrieve all vaccination records for a patient
    function getHashes(address patient) public view returns (bytes32[] memory) {
        require(vaccinationRecords[patient].length > 0, "No vaccination records found");

        bytes32[] memory hashes = new bytes32[](vaccinationRecords[patient].length);
        for (uint256 i = 0; i < vaccinationRecords[patient].length; i++) {
            hashes[i] = vaccinationRecords[patient][i].dataHash;
        }
        return hashes;
    }

    // Grant access to a researcher
    function grantAccess(address researcher) public {
        authorizedResearchers[researcher] = true;
        emit ResearcherAuthorized(researcher);
    }

    // Verify if a researcher has access
    function isResearcherAuthorized(address researcher) public view returns (bool) {
        return authorizedResearchers[researcher];
    }
}
