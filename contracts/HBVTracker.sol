// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract HBVTracker {
    using ECDSA for bytes32;

    struct VaccinationRecord {
        bytes32 dataHash;
        bool exists;
    }

    mapping(address => VaccinationRecord) private vaccinationHashes;
    mapping(address => bool) public authorizedHealthcareProviders;
    mapping(address => bool) public authorizedResearchers;

    event VaccinationStored(address indexed patient, bytes32 dataHash);
    event VaccinationUpdated(address indexed patient, bytes32 newDataHash);
    event ResearcherAuthorized(address indexed researcher);

    // Store vaccination hash (Only the owner can update)
    function storeHash(bytes32 dataHash, bytes memory signature) public {
        require(
            verifySignature(msg.sender, dataHash, signature),
            "Invalid signature"
        );

        vaccinationHashes[msg.sender] = VaccinationRecord(dataHash, true);
        emit VaccinationStored(msg.sender, dataHash);
    }

    // Retrieve vaccination hash (Anyone can check)
    function getHash(address user) public view returns (bytes32) {
        require(vaccinationHashes[user].exists, "No vaccination record found");
        return vaccinationHashes[user].dataHash;
    }

    // Grant access to a researcher for anonymous data verification
    function grantAccess(address researcher) public {
        authorizedResearchers[researcher] = true;
        emit ResearcherAuthorized(researcher);
    }

    // Verify if a researcher has access
    function isResearcherAuthorized(address researcher) public view returns (bool) {
        return authorizedResearchers[researcher];
    }

    // Update vaccination record (Only authorized healthcare providers can do this)
    function updateRecord(
        address patient,
        bytes32 newDataHash,
        bytes memory signature
    ) public {
        require(
            authorizedHealthcareProviders[msg.sender],
            "Not an authorized healthcare provider"
        );
        require(
            verifySignature(patient, newDataHash, signature),
            "Invalid signature"
        );

        vaccinationHashes[patient] = VaccinationRecord(newDataHash, true);
        emit VaccinationUpdated(patient, newDataHash);
    }

    // Verify a signature using OpenZeppelin's ECDSA library
    function verifySignature(
        address signer,
        bytes32 dataHash,
        bytes memory signature
    ) internal pure returns (bool) {
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash)
        );
        return ethSignedMessageHash.recover(signature) == signer;
    }
}
