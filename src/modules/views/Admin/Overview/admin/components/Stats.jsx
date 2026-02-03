import React from 'react'
import Skeleton from 'react-loading-skeleton';
import { PiUsersFourDuotone } from "react-icons/pi";
import { IoIosGitBranch } from "react-icons/io";
import { GiTakeMyMoney,GiMoneyStack } from "react-icons/gi";
import { formatNumber, formatCurrency, formatNumberWithCommas } from '@/utility/numberFormatter';

const Stats = (props) => {
    let {StatsDataObject, BusinessLoanSummaryDataObject} = props

    let {
        loading,
        data
    } = StatsDataObject;
    let Datastats = data?.data
    let BusinessLoanSummaryData = BusinessLoanSummaryDataObject?.data?.data


    const statsData = [
        {
            title: "Total Principal",
            value: BusinessLoanSummaryData?.loans?.summary?.total_principal,
            formattedValue: 'GHS ' + formatNumberWithCommas(BusinessLoanSummaryData?.loans?.summary?.total_principal),
            icon: <GiMoneyStack />,
            color: "#4D4D4D",
            gradient: "linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%)",
            bgColor: "rgba(95, 99, 242, 0.1)"
        },
        {
            title: "Total Interest",
            value: BusinessLoanSummaryData?.loans?.summary?.total_interest,
            formattedValue: 'GHS ' + formatNumberWithCommas(BusinessLoanSummaryData?.loans?.summary?.total_interest),
            icon: <PiUsersFourDuotone />,
            color: "#28a745",
            gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            bgColor: "rgba(40, 167, 69, 0.1)"
        },
        {
            title: "Total Fees",
            value: BusinessLoanSummaryData?.loans?.summary?.total_fees,
            formattedValue: 'GHS ' + formatNumberWithCommas(BusinessLoanSummaryData?.loans?.summary?.total_fees),
            icon: <GiTakeMyMoney />,
            color: "#ffc107",
            gradient: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)",
            bgColor: "rgba(255, 193, 7, 0.1)"
        },
        {
            title: "Total Repayment",
            value: BusinessLoanSummaryData?.loans?.summary?.total_repayment,
            formattedValue: 'GHS ' + formatNumberWithCommas(BusinessLoanSummaryData?.loans?.summary?.total_repayment),
            icon: <IoIosGitBranch />,
            color: "#17a2b8",
            gradient: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
            bgColor: "rgba(23, 162, 184, 0.1)"
        },
        {
            title: "Total Paid Amount",
            value: BusinessLoanSummaryData?.loans?.summary?.total_paid_amount,
            formattedValue: 'GHS ' + formatNumberWithCommas(BusinessLoanSummaryData?.loans?.summary?.total_paid_amount),
            icon: <GiTakeMyMoney />,
            color: "#28a745",
            gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            bgColor: "rgba(40, 167, 69, 0.1)"
        },
        {
            title: "Outstanding Balance",
            value: BusinessLoanSummaryData?.loans?.summary?.outstanding_balance,
            formattedValue: 'GHS ' + formatNumberWithCommas(BusinessLoanSummaryData?.loans?.summary?.outstanding_balance),
            icon: <IoIosGitBranch />,
            color: "#dc3545",
            gradient: "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
            bgColor: "rgba(220, 53, 69, 0.1)"
        },
        {
            title: "Active Loans",
            value: BusinessLoanSummaryData?.globalSummary?.activeLoans,
            formattedValue: formatNumberWithCommas(BusinessLoanSummaryData?.globalSummary?.activeLoans),
            icon: <GiMoneyStack />,
            color: "#4D4D4D",
            gradient: "linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%)",
            bgColor: "rgba(95, 99, 242, 0.1)"
        },
        {
            title: "Active Borrowers",
            value: BusinessLoanSummaryData?.globalSummary?.activeBorrowers,
            formattedValue: formatNumberWithCommas(BusinessLoanSummaryData?.globalSummary?.activeBorrowers),
            icon: <PiUsersFourDuotone />,
            color: "#28a745",
            gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            bgColor: "rgba(40, 167, 69, 0.1)"
        },
        {
            title: "Total Loans",
            value: BusinessLoanSummaryData?.globalSummary?.totalLoans,
            formattedValue: formatNumberWithCommas(BusinessLoanSummaryData?.globalSummary?.totalLoans),
            icon: <IoIosGitBranch />,
            color: "#17a2b8",
            gradient: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
            bgColor: "rgba(23, 162, 184, 0.1)"
        },
        {
            title: "Overdue Loans",
            value: BusinessLoanSummaryData?.globalSummary?.overdueLoans,
            formattedValue: formatNumberWithCommas(BusinessLoanSummaryData?.globalSummary?.overdueLoans),
            icon: <GiTakeMyMoney />,
            color: "#dc3545",
            gradient: "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
            bgColor: "rgba(220, 53, 69, 0.1)"
        },
        {
            title: "Loans Due Today",
            value: BusinessLoanSummaryData?.globalSummary?.loansDueToday,
            formattedValue: formatNumberWithCommas(BusinessLoanSummaryData?.globalSummary?.loansDueToday),
            icon: <GiTakeMyMoney />,
            color: "#ffc107",
            gradient: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)",
            bgColor: "rgba(255, 193, 7, 0.1)"
        },
        {
            title: "Loan Requests",
            value: BusinessLoanSummaryData?.globalSummary?.loanRequests,
            formattedValue: formatNumberWithCommas(BusinessLoanSummaryData?.globalSummary?.loanRequests),
            icon: <PiUsersFourDuotone />,
            color: "#6f42c1",
            gradient: "linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%)",
            bgColor: "rgba(111, 66, 193, 0.1)"
        }
    ];

    return (
        <>
            {statsData.map((stat, index) => (
                <div key={index} className="stat-card-wrapper">
                    <div className="stat-card" style={{ '--card-color': stat.color, '--card-gradient': stat.gradient, '--card-bg': stat.bgColor }}>
                        <div className="stat-icon-container">
                            <div className="stat-icon">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">
                                {loading ? (
                                    <Skeleton width="60px" height="24px" />
                                ) : (
                                    <span className="value-text">{stat.formattedValue}</span>
                                )}
                            </div>
                            <div className="stat-title">
                                <span>{stat.title}</span>
                            </div>
                        </div>
                        <div className="stat-decoration">
                            <div className="decoration-circle"></div>
                        </div>
                    </div>
                </div>
            ))}

            <style jsx>{`
                .stat-card-wrapper {
                    width: 100%;
                }

                .stat-card {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 25px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(95, 99, 242, 0.1);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .stat-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--card-gradient);
                }

                .stat-icon-container {
                    flex-shrink: 0;
                }

                .stat-icon {
                    width: 55px;
                    height: 55px;
                    border-radius: 14px;
                    background: var(--card-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: var(--card-color);
                    position: relative;
                    transition: all 0.3s ease;
                }

                .stat-card:hover .stat-icon {
                    transform: scale(1.1);
                    background: var(--card-gradient);
                    color: #ffffff;
                }

                .stat-content {
                    flex: 1;
                    min-width: 0;
                }

                .stat-value {
                    margin-bottom: 8px;
                }

                .value-text {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #2c3e50;
                    line-height: 1;
                    display: block;
                }

                .stat-title {
                    color: #6c757d;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stat-decoration {
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    opacity: 0.1;
                    transition: all 0.3s ease;
                }

                .stat-card:hover .stat-decoration {
                    opacity: 0.2;
                    transform: scale(1.2);
                }

                .decoration-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: var(--card-gradient);
                }

                @media (max-width: 768px) {
                    .stat-card {
                        padding: 20px;
                        gap: 15px;
                    }

                    .stat-icon {
                        width: 45px;
                        height: 45px;
                        font-size: 1.3rem;
                    }

                    .value-text {
                        font-size: 1.1rem;
                    }

                    .stat-title {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 480px) {
                    .stat-card {
                        padding: 15px;
                        gap: 12px;
                    }

                    .stat-icon {
                        width: 45px;
                        height: 45px;
                        font-size: 1.3rem;
                    }

                    .value-text {
                        font-size: 1.0rem;
                    }
                }
            `}</style>
        </>
    )
}

export default Stats
