import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProposalsInDeposit,
  getProposalsInVoting,
  resetTx,
  txVote,
} from "../../../features/gov/govSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { ProposalItem } from "./ProposalItem";
import {
  setError,
  resetError,
  resetTxHash,
} from "../../../features/common/commonSlice";
import { authzExecHelper } from "../../../features/authz/authzSlice";
import VoteDialog from "../../../components/Vote";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";
import { nameToVoteOption } from "../../../utils/proposals";
import { FeegrantCheckbox } from "../../../components/FeegrantCheckbox";
import { Checkbox, FormControlLabel } from "@mui/material";

Proposals.propTypes = {
  id: PropTypes.number.isRequired,
  restEndpoint: PropTypes.string.isRequired,
  chainName: PropTypes.string.isRequired,
  chainLogo: PropTypes.string.isRequired,
  signer: PropTypes.string.isRequired,
  chainID: PropTypes.string.isRequired,
  gasPriceStep: PropTypes.object.isRequired,
  aminoConfig: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  bech32Config: PropTypes.object.isRequired,
  authzMode: PropTypes.bool.isRequired,
  grantsToMe: PropTypes.array.isRequired,
};

export default function Proposals({
  id,
  restEndpoint,
  chainName,
  chainLogo,
  signer,
  gasPriceStep,
  chainID,
  aminoConfig,
  currencies,
  bech32Config,
  authzMode,
  grantsToMe,
  isChainSpecific,
}) {
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);
  const proposalTally = useSelector(
    (state) => state.gov.tally[chainID]?.proposalTally || {}
  );
  const votes = useSelector(
    (state) => state.gov.votes[chainID]?.proposals || {}
  );
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[chainName.toLowerCase()] || {}
  );

  const govTx = useSelector((state) => state.gov.tx);
  const currency = currencies[0];

  const votingProposals = useSelector(
    (state) => state.gov.active[chainID]?.proposals || []
  );

  const depositProposals = useSelector(
    (state) => state.gov.deposit[chainID]?.proposals || []
  );
  const loading = useSelector((state) => state.gov.loading);

  const [proposals, setProposals] = useState([]);

  const dispatch = useDispatch();
  const [showDepositProposal, setShowDepositProposals] = useState(false);
  useEffect(() => {
    if (depositProposals.length > 0 && showDepositProposal) {
      setProposals([...votingProposals, ...depositProposals]);
    }
  }, [depositProposals, showDepositProposal]);

  useEffect(() => {
    if (votingProposals.length > 0 && !showDepositProposal) {
      setProposals([...votingProposals]);
    }
  }, [votingProposals]);

  useEffect(() => {
    if (!showDepositProposal) {
      setProposals(votingProposals);
    }
  }, [showDepositProposal]);

  useEffect(() => {
    setShowDepositProposals(false);
  }, [chainID]);

  const fetchDepositProposals = () => {
    if (depositProposals?.length === 0)
      dispatch(
        getProposalsInDeposit({
          baseURL: restEndpoint,
          chainID: chainID,
        })
      );
  };

  useEffect(() => {
    if (!authzMode || (authzMode && grantsToMe?.length > 0)) {
      dispatch(
        getProposalsInVoting({
          baseURL: restEndpoint,
          voter: signer,
          chainID: chainID,
        })
      );
    }
    setProposals([]);

    return () => {
      dispatch(resetError());
      dispatch(resetTxHash());
      dispatch(resetTx());
      setOpen(false);
    };
  }, [chainID]);

  useEffect(() => {
    if (status === "rejected" && errMsg === "") {
      dispatch(
        setError({
          type: "error",
          message: errMsg,
        })
      );
    }
  }, [errMsg, status]);

  const onVoteSubmit = (data) => {
    const vote = nameToVoteOption(data.option);
    if (!authzMode) {
      dispatch(
        txVote({
          voter: signer,
          proposalId: selected,
          option: vote,
          denom: currency.coinMinimalDenom,
          chainId: chainID,
          rest: restEndpoint,
          aminoConfig: aminoConfig,
          prefix: bech32Config.bech32PrefixAccAddr,
          feeAmount: gasPriceStep.average * 10 ** currency.coinDecimals,
          feegranter: useFeegrant ? feegrant?.granter : "",
          justification: data.justification,
        })
      );
    } else {
      if (data?.granter?.length > 0) {
        authzExecHelper(dispatch, {
          type: "vote",
          from: signer,
          granter: data.granter,
          option: vote,
          proposalId: selected,
          denom: currency.coinMinimalDenom,
          chainId: chainID,
          rest: restEndpoint,
          aminoConfig: aminoConfig,
          prefix: bech32Config.bech32PrefixAccAddr,
          feeAmount: gasPriceStep.average * 10 ** currency.coinDecimals,
          feegranter: useFeegrant ? feegrant?.granter : "",
          metadata: data.justification,
        });
      } else {
        alert("granter is empty");
      }
    }
  };

  const [open, setOpen] = useState(false);
  const closeDialog = () => {
    setOpen(false);
  };

  const [selected, setonShowVote] = useState("");
  const onVoteDialog = (proposalId) => {
    setOpen(true);
    setonShowVote(proposalId);
  };

  const navigate = useNavigate();

  const [useFeegrant, setUseFeegrant] = React.useState(false);

  return (authzMode && grantsToMe?.length > 0) || !authzMode ? (
    <React.Fragment key={id}>
      {isChainSpecific && (
        <ChainProposalsHeader
          navigate={navigate}
          chainName={chainName}
          showDepositProposal={showDepositProposal}
          setShowDepositProposals={setShowDepositProposals}
          fetchDepositProposals={fetchDepositProposals}
          useFeegrant={useFeegrant}
          setUseFeegrant={setUseFeegrant}
          feegrant={feegrant}
          chainLogo={chainLogo}
        />
      )}
      {!proposals?.length && !loading ? (
        <>
          {isChainSpecific && (
            <Typography sx={{ mt: 6 }} variant="h6" color="text.primary">
              - No Proposals Found -
            </Typography>
          )}
        </>
      ) : (
        <>
          {proposals?.length && !isChainSpecific ? (
            <ChainProposalsHeader
              navigate={navigate}
              chainName={chainName}
              showDepositProposal={showDepositProposal}
              setShowDepositProposals={setShowDepositProposals}
              fetchDepositProposals={fetchDepositProposals}
              useFeegrant={useFeegrant}
              setUseFeegrant={setUseFeegrant}
              feegrant={feegrant}
              chainLogo={chainLogo}
            />
          ) : null}
        </>
      )}
      {status === "pending" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: 22,
          }}
        >
          <CircularProgress />
        </div>
      ) : proposals.length === 0 ? (
        <></>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            mb: 1,
          }}
        >
          {proposals.map((proposal, index) => (
            <Grid item md={6} xs={12} key={index}>
              <ProposalItem
                info={proposal}
                tally={proposalTally[proposal?.proposal_id]}
                vote={votes[proposal?.proposal_id]}
                txStatus={govTx}
                setOpen={(pId) => onVoteDialog(pId)}
                onItemClick={() =>
                  navigate(
                    `/${chainName?.toLowerCase()}/proposals/${
                      proposal?.proposal_id
                    }`
                  )
                }
                chainUrl={restEndpoint}
                proposalId={proposal?.proposal_id}
                chainName={chainName}
                address={signer}
              />
            </Grid>
          ))}

          <VoteDialog
            open={open}
            closeDialog={closeDialog}
            onVote={onVoteSubmit}
            isAuthzMode={authzMode}
            granters={grantsToMe || []}
          />
        </Grid>
      )}
    </React.Fragment>
  ) : (
    <React.Fragment key={id}>
      {isChainSpecific && (
        <Typography variant="h6" fontWeight={600} color="text.primary">
          You don't have authz permission.
        </Typography>
      )}
    </React.Fragment>
  );
}

const ChainProposalsHeader = (props) => {
  const {
    navigate,
    chainName,
    showDepositProposal,
    setShowDepositProposals,
    fetchDepositProposals,
    useFeegrant,
    setUseFeegrant,
    feegrant,
    chainLogo,
  } = props;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 3,
        mb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
        }}
      >
        <Avatar
          src={chainLogo}
          alt="network-icon"
          sx={{
            width: 30,
            height: 30,
          }}
        />
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "text.primary",
            ml: 1,
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(`/${chainName.toLowerCase()}/gov`);
          }}
        >
          {chainName}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                setShowDepositProposals(e.target.checked);
                if (e.target.checked) {
                  fetchDepositProposals();
                }
              }}
              checked={showDepositProposal}
            />
          }
          label={<Typography color="text.primary">Show in deposit</Typography>}
        />
        <Box sx={{ ml: 3 }}>
          <FeegrantCheckbox
            useFeegrant={useFeegrant}
            setUseFeegrant={setUseFeegrant}
            feegrant={feegrant}
          />
        </Box>
      </Box>
    </Box>
  );
};
