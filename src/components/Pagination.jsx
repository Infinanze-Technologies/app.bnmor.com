import React from "react";
import PropTypes from "prop-types";
import getPages from "./getPages";
const Pagination = ({ activePage, pages, setActivePage }) => {
    return (
        <div className="table-filter-info text-center">
            <div className="dt-pagination">
                <ul className="dt-pagination-ul">
                    <li
                        className={`dt-item ${activePage === 1 ? "inactive" : ""}`}
                        // className={`dt-item`}
                        onClick={() => activePage !== 1 && setActivePage((page) => page - 1)}
                    >
                        <a
                            className="dt-link"

                        >
                            Prev
                        </a>
                    </li>


                    {getPages()}



                    <li
                        className="dt-item"
                        onClick={() =>
                            activePage !== pages && setActivePage((page) => page + 1)
                        }
                    >
                        <a
                            className="dt-link"

                        >
                            Next
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

// activePage, setActivePage and pages will be passed down as props

Pagination.propTypes = {
    activePage: PropTypes.number,
    pages: PropTypes.number,
    setActivePage: PropTypes.func,
};

export default Pagination;
