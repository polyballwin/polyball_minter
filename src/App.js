import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/polyballTickt.gif";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 20px;
  background-color: #000;
  padding: 10px;
  font-weight: bold;
  color: #fff;
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 70%;
  margin: -60px 0 -30px;
  @media (min-width: 767px) {
    width: 80%;
    margin: 0;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledInput = styled.input`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #000;
  padding: 10px;
  font-weight: bold;
  color: #fff;
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("Excluding gas fee");
  const [claimingNft, setClaimingNft] = useState(false);
  const contract_addr = "0x5c103d2c897C7533164b103768Bc06Ecf98bDc8E"
  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Minting your Polyball tickets");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        gasLimit: (142500 * _amount).toString(), // adaptive gas limit
        to: contract_addr,
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((0.066 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "WOW, you now own Polyball! Visit Opensea.io to view it."
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  var get_input = () => {
    var x = document.getElementById("input").value;
    if (x > 35){
      alert("Mint number should be less than or equal to 35!")
      return 0
    }
    return x
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--page)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 5 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 28, fontWeight: "bold", marginTop: "20px"}}
        >
          Polyball tickets minter
        </s.TextTitle>
        <ResponsiveWrapper flex={1} style={{ padding: 12 }}>
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "var(--rightBox)", borderRadius: 50 }}
          >
            {Number(data.totalSupply) == 10010 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still find polyball tickets on{" "}
                  <a
                    target={"_blank"}
                    href={"https://opensea.io/collection/polyball"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                0.066 ETH each ticket
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    {/* CONNECT BUTTON */}
                    <s.TextDescription style={{ textAlign: "center", fontSize: 24 }}>
                      Coming soon
                    </s.TextDescription>
                    {/* <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton> */}

                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription style={{ textAlign: "center" }}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledInput placeholder="Mint number" id = "input">
                    </StyledInput>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        var num = get_input();
                        e.preventDefault();
                        claimNFTs(num);
                        getData();
                      }}
                    >
                      {claimingNft ? "BUSY" : "BUY"}
                    </StyledButton>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
          <s.SpacerMedium />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"polyball"} src={i1} />
            <s.SpacerMedium />
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 30, fontWeight: "bold" }}
            >
              {data.totalSupply}/10010
            </s.TextTitle>
          </s.Container>
        </ResponsiveWrapper>
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%", margin: "0 auto 20px"}}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
          You cannot undo this action. Please check your network (Polygon Mainnet) and the correct address.
          </s.TextDescription>
          {/* <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
            Recommended gas limit to mint your tickets: 142500 each ticket.
          </s.TextDescription> */}
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
