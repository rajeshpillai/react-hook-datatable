import React from "react";
import "./pagination.css";

export default function Pagination(props) {
  const [state, setData] = React.useState({
    currentPage: props.currentPage || 1,
  });
  const pageLengthInput = React.useRef();
  const currentPageInput = React.useRef();
  let totalRecords = props.totalRecords;
  let pages = Math.ceil(totalRecords / props.pageLength);

  // Update local state, when the parent changes the props
  React.useEffect(() => {
    setData({
      ...state,
      ...props,
    });

    //Added to change the current page back to 1 if current page does not exist due to change in pageLength
    if (
      currentPageInput.current &&
      currentPageInput.current.value != props.currentPage
    ) {
      currentPageInput.current.value = props.currentPage;
    }
  }, [props]);

  // const onPageLengthChange = () => {
  //   props.onPageLengthChange(pageLengthInput.current.value);
  // };

  const onKeyUp = (e) => {
    // alert(e.which == 13);
    if (e.which == 13) {
      props.onPageLengthChange(pageLengthInput.current.value);
    }
  };

  const onPrevPage = (e) => {
    if (state.currentPage === 1) return;
    onGotoPage(state.currentPage - 1);
  };

  const onNextPage = (e) => {
    if (state.currentPage > pages - 1) return;
    onGotoPage(state.currentPage + 1);
  };

  const onGotoPage = (pageNo) => {
    if (pageNo === state.currentPage) {
      return;
    }
    if (currentPageInput && currentPageInput.current) {
      currentPageInput.current.value = pageNo;
    }

    setData({
      currentPage: pageNo,
    });

    props.onGotoPage(pageNo);
  };

  const onCurrentPageChange = (e) => {
    if (currentPageInput.current.value >= pages) {
      currentPageInput.current.value = pages;
    }
    setData({
      currentPage: currentPageInput.current.value,
    });

    props.onGotoPage(currentPageInput.current.value);
  };

  const getPaginationButtons = (text) => {
    let classNames = "pagination-btn";

    // May need refactor
    if (state.currentPage == text) {
      classNames += " current-page";
    }

    let html = (
      <button
        key={`btn-${text}`}
        id={`btn-${text}`}
        className={classNames}
        onClick={(e) => {
          onGotoPage(text);
        }}
      >
        {text}
      </button>
    );
    return html;
  };

  let pageSelector = (
    <React.Fragment key="f-page-selector">
      <span key="page-selector" className="page-selector">
        Rows per page:
        <input
          key="page-input"
          type="number"
          min="1"
          ref={pageLengthInput}
          defaultValue={props.pageLength || 5}
          // onChange={onPageLengthChange}
          onKeyUp={onKeyUp}
        />
      </span>
    </React.Fragment>
  );

  let prevButton = (
    <button key="prev" className="pagination-btn prev" onClick={onPrevPage}>
      {"<"}
    </button>
  );

  let nextButton = (
    <button key="next" className="pagination-btn next" onClick={onNextPage}>
      {">"}
    </button>
  );
  let buttons = [];
  if (props.type === "long") {
    for (let i = 1; i <= pages; i++) {
      buttons.push(getPaginationButtons(i));
    }
  } else if (props.type === "short") {
    buttons.push(
      <input
        key="currentPageInput"
        className="current-page-input"
        type="number"
        max={pages}
        defaultValue={state.currentPage}
        ref={currentPageInput}
        onChange={onCurrentPageChange}
      />
    );
  }

  return (
    <div className="pagination">
      {[pageSelector, prevButton, buttons, nextButton]}
    </div>
  );
}
