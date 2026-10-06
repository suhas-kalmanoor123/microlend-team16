// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LoanAgreement
/// @notice Records a micro-loan agreement and its repayments on-chain.
/// No money moves here and no private data is stored. Financial analysis
/// stays off-chain; this contract is the tamper-resistant record.
contract LoanAgreement {
    enum Status { Active, Completed }

    struct Loan {
        string loanId;
        address borrower;
        address lender;
        uint256 principal;      // amount in rupees, informational only
        uint256 tenureMonths;
        Status status;
        uint256 repaymentCount;
        uint256 createdAt;
    }

    mapping(bytes32 => Loan) private loans;
    mapping(bytes32 => bool) private exists;

    event LoanCreated(string loanId, address indexed borrower, address indexed lender, uint256 principal, uint256 tenureMonths);
    event RepaymentRecorded(string loanId, uint256 repaymentNumber, uint256 timestamp);
    event LoanCompleted(string loanId, uint256 timestamp);

    function _key(string memory loanId) private pure returns (bytes32) {
        return keccak256(bytes(loanId));
    }

    /// @notice Only the borrower can create their own loan record,
    /// which stops anyone writing fake records in someone else's name.
    function createLoan(
        string calldata loanId,
        address borrower,
        address lender,
        uint256 principal,
        uint256 tenureMonths
    ) external {
        bytes32 k = _key(loanId);
        require(!exists[k], "Loan already exists");
        require(msg.sender == borrower, "Only the borrower can create the record");
        require(tenureMonths > 0, "Tenure must be positive");

        loans[k] = Loan(loanId, borrower, lender, principal, tenureMonths, Status.Active, 0, block.timestamp);
        exists[k] = true;
        emit LoanCreated(loanId, borrower, lender, principal, tenureMonths);
    }

    /// @notice Borrower or lender records one monthly repayment.
    function recordRepayment(string calldata loanId) external {
        bytes32 k = _key(loanId);
        require(exists[k], "Loan not found");
        Loan storage l = loans[k];
        require(msg.sender == l.borrower || msg.sender == l.lender, "Not a party to this loan");
        require(l.status == Status.Active, "Loan not active");
        require(l.repaymentCount < l.tenureMonths, "All repayments recorded");

        l.repaymentCount += 1;
        emit RepaymentRecorded(loanId, l.repaymentCount, block.timestamp);
    }

    /// @notice Marks the loan completed once every repayment is recorded.
    function completeLoan(string calldata loanId) external {
        bytes32 k = _key(loanId);
        require(exists[k], "Loan not found");
        Loan storage l = loans[k];
        require(msg.sender == l.borrower || msg.sender == l.lender, "Not a party to this loan");
        require(l.status == Status.Active, "Loan not active");
        require(l.repaymentCount == l.tenureMonths, "Repayments incomplete");

        l.status = Status.Completed;
        emit LoanCompleted(loanId, block.timestamp);
    }

    function getLoan(string calldata loanId) external view returns (Loan memory) {
        bytes32 k = _key(loanId);
        require(exists[k], "Loan not found");
        return loans[k];
    }
}