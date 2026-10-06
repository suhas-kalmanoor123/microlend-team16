// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MicroLoan
/// @notice Records micro-loans and repayments on-chain. Test network only.
/// @dev No personal data is stored here, only loan numbers and status.
contract MicroLoan {
    enum Status { None, Active, Completed }

    struct Loan {
        uint256 principal;
        uint256 tenureMonths;
        uint256 monthlyRepayment;
        uint256 repaymentsMade;
        Status status;
    }

    // Loans are looked up by the same id the app uses (Loan.id).
    mapping(string => Loan) private loans;

    event LoanCreated(string loanId, uint256 principal, uint256 tenureMonths, uint256 monthlyRepayment);
    event RepaymentRecorded(string loanId, uint256 repaymentsMade);
    event LoanCompleted(string loanId);

    /// @notice Record a new agreed loan.
    function createLoan(
        string calldata loanId,
        uint256 principal,
        uint256 tenureMonths,
        uint256 monthlyRepayment
    ) external {
        require(loans[loanId].status == Status.None, "Loan already exists");
        require(principal > 0 && tenureMonths > 0, "Invalid loan");
        loans[loanId] = Loan(principal, tenureMonths, monthlyRepayment, 0, Status.Active);
        emit LoanCreated(loanId, principal, tenureMonths, monthlyRepayment);
    }

    /// @notice Record one monthly repayment.
    function recordRepayment(string calldata loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.status == Status.Active, "Loan not active");
        require(loan.repaymentsMade < loan.tenureMonths, "All repayments recorded");
        loan.repaymentsMade += 1;
        emit RepaymentRecorded(loanId, loan.repaymentsMade);
    }

    /// @notice Mark the loan as finished once every repayment is recorded.
    function completeLoan(string calldata loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.status == Status.Active, "Loan not active");
        require(loan.repaymentsMade == loan.tenureMonths, "Repayments incomplete");
        loan.status = Status.Completed;
        emit LoanCompleted(loanId);
    }

    /// @notice Read a loan's recorded details.
    function getLoan(string calldata loanId)
        external
        view
        returns (
            uint256 principal,
            uint256 tenureMonths,
            uint256 monthlyRepayment,
            uint256 repaymentsMade,
            Status status
        )
    {
        Loan storage loan = loans[loanId];
        require(loan.status != Status.None, "Loan not found");
        return (loan.principal, loan.tenureMonths, loan.monthlyRepayment, loan.repaymentsMade, loan.status);
    }
}