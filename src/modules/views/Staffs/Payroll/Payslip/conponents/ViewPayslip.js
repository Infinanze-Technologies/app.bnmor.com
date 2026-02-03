import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
} from "antd";
const { Option } = Select;
import { postRequest } from "@/hooks/apiService";
import { URL_CREATE_ROLE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
const accounting = require('accounting');
const ViewPayslip = (props) => {
  const {record } = props;
  let earnings = Number(record?.salary) + Number(record?.overtime) + Number(record?.other_payment) + Number(record?.commission) + Number(record?.allowance)


  return (
    <>
    <div>
    <div className="modal-body">
  {/* <div className="text-md-end mb-2">
    <a
      href="#"
      className="btn btn-sm btn-primary"
      data-bs-toggle="tooltip"
      data-bs-placement="bottom"
      title="Download"
      onclick="saveAsPDF()"
    >
      <span className="fa fa-download" />
    </a>
    <a
      title="Mail Send"
      href="https://demo.rajodiya.com/hrmgo/payslip/send/1/2023-12"
      className="btn btn-sm btn-warning"
    >
      <span className="fa fa-paper-plane" />
    </a>
  </div> */}
  <div className="invoice" id="printableArea">
    <div className="row">
      <div className="col-form-label">
        <div className="invoice-number">
        <h3> {record?.business?.name}</h3>
       
          {/* <img
            src="https://demo.rajodiya.com/hrmgo/storage/uploads/logo//logo-dark.png"
            width="170px;"
          /> */}
        </div>
        <div className="invoice-print">
          <div className="row">
            <div className="col-lg-12">
              <div className="invoice-title"></div>
              <hr />
              <div className="row text-sm">
                <div className="col-md-6">
                  <address>
                    <strong>Name :</strong> {record?.employee?.fullname}
                    <br />
                    <strong>Position :</strong>{record?.employee?.fullname}
                    <br />
                    <strong>Salary Date :</strong>
                    {record?.createdAt}
                    <br />
                  </address>
                </div>
                <div className="col-md-6 text-end">
                  <address>
                    <strong>{record?.business?.name} </strong>
                    <br />
                   {record?.business?.address} - {record?.business?.country}
                    <br />
                    {/* GUJARAT-395006
                    <br /> */}
                    <strong>Salary Slip :</strong>      {record?.month}-{record?.year}
                    <br />
                  </address>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table  table-md">
                  <tbody>
                    <tr className="font-weight-bold">
                      <th>Earning</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th className="text-right" style={{ textAlign:'end' }}>Amount</th>
                    </tr>
                    <tr>
                      <td>Basic Salary</td>
                      <td>-</td>
                      <td>-</td>
                      <td className="text-right" style={{ textAlign:'end' }}>{accounting.formatMoney(record?.salary, { symbol: '₵', format: '%s%v' })}</td>
                    </tr>
                    

                    {
                        record?.allowance_data?.length > 0 &&
                        
                        record?.allowance_data?.map(data => (
                        <>
                        <tr>
                      <td>Allowance</td>
                      <td>{data?.title}</td>
                      <td>{data?.amount_type}</td>
                      <td className="text-right" style={{ textAlign:'end' }}>{data?.amount_type == "Fixed" ? `₵ ${(data?.amount).toFixed(2)}`: `${data?.sal_amount}%(${(data?.amount).toFixed(2)})`}</td>
                    </tr>
                        </>
                    ))}



                    {
                        record?.commission_data?.length > 0 &&
                        
                        record?.commission_data?.map(data => (
                        <>
                        <tr>
                      <td>Commission</td>
                      <td>{data?.title}</td>
                      <td>{data?.amount_type}</td>
                      <td className="text-right" style={{ textAlign:'end' }}>{data?.amount_type == "Fixed" ? `₵ ${(data?.amount).toFixed(2)}`: `${data?.sal_amount}%(${(data?.amount).toFixed(2)})`}</td>
                    </tr>
                        </>
                    ))}


                    {
                        record?.other_payment_data?.length > 0 &&
                        
                        record?.other_payment_data?.map(data => (
                        <>
                        <tr>
                      <td>Other Payment</td>
                      <td>{data?.title}</td>
                      <td>{data?.amount_type}</td>
                      <td className="text-right" style={{ textAlign:'end' }}>{data?.amount_type == "Fixed" ? `₵ ${(data?.amount).toFixed(2)}`: `${data?.sal_amount}%(${(data?.amount).toFixed(2)})`}</td>
                    </tr>
                        </>
                    ))}
                   
                    {
                        record?.overtime_data?.length > 0 &&
                        
                        record?.overtime_data?.map(data => (
                        <>
                        <tr>
                      <td>OverTime</td>
                      <td>{data?.title}</td>
                      <td>-</td>
                      <td className="text-right" style={{ textAlign:'end' }}>{accounting.formatMoney(data?.amount, { symbol: '₵', format: '%s%v' })}</td>
                    </tr>
                        </>
                    ))}

                  </tbody>
                </table>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-hover table-md">
                  <tbody>
                    <tr className="font-weight-bold">
                      <th>Deduction</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th className="text-right">Amount</th>
                    </tr>

                    {
                        record?.deduction_data?.length > 0 &&
                        
                        record?.deduction_data?.map(data => (
                        <>
                        <tr>
                      <td>Saturation Deduction</td>
                      <td>{data?.title}</td>
                      <td>{data?.amount_type}</td>
                      <td className="text-right" style={{ textAlign:'end' }}>
                      {data?.amount_type == "Fixed" ? `₵ ${(data?.amount).toFixed(2)}`: `${data?.sal_amount}%(${(data?.amount).toFixed(2)})`}
                      </td>
                    </tr>
                        </>
                    ))}
                    {/* <tr>
                      <td>Loan</td>
                      <td>Natus placeat qui e </td>
                      <td>Fixed</td>
                      <td className="text-right">$1,000.00</td>
                    </tr> */}
                  
                  </tbody>
                </table>
              </div>
              <div className="row mt-4">
                {/* <div className="col-lg-8"></div> */}

                <div className="row text-right  text-sm ">
                  <div className="col-12 invoice-detail-item pb-2" style={{display:"flex",justifyContent:'end'}}>
                    <div className="invoice-detail-name font-weight-bold">
                      Total Earning : 
                    </div>
                    <div className="invoice-detail-value">     {accounting.formatMoney(earnings, { symbol: '₵', format: '%s%v' })} </div>
                  </div>


                  <div className="col-12 invoice-detail-item" style={{display:"flex",justifyContent:'end'}}>
                    <div className="invoice-detail-name font-weight-bold">
                      Total Deduction :
                    </div>
                    <div className="invoice-detail-value"> {accounting.formatMoney(record?.deductions, { symbol: '₵', format: '%s%v' })}</div>
                  </div>


                  <hr className="mt-2 mb-2" />
                  <div className="invoice-detail-item" style={{display:"flex",justifyContent:'end'}}>
                    <div className="invoice-detail-name font-weight-bold">
                      Net Salary : 
                    </div>
                    <div className="invoice-detail-value invoice-detail-value-lg">
                    {accounting.formatMoney(record?.net_salary, { symbol: '₵', format: '%s%v' })}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
        <hr />
        {/* <div className="text-md-right pb-2 text-sm">
          <div className="float-lg-left mb-lg-0 mb-3 ">
            <p className="mt-2">Employee Signature</p>
          </div>
          <p className="mt-2 "> Paid By</p>
        </div> */}
      </div>
    </div>
  </div>
</div>

    </div>

    </>
  );
};

export default ViewPayslip;
