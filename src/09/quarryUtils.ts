import { Program, AnchorProvider, utils } from "@project-serum/anchor";
import {
  QuarryData,
  QuarrySDK,
  RewarderData,
} from "@quarryprotocol/quarry-sdk";
import {
  ParsedAccountDatum,
  useParsedAccountsData,
  usePubkey,
  useToken,
} from "@saberhq/sail";
import { SignerWallet, TransactionEnvelope } from "@saberhq/solana-contrib";
import { Keypair, PublicKey } from "@solana/web3.js";

import { PARSE_QUARRY, RedeemerInfo } from "@quarryprotocol/react-quarry";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Goodies } from "./Button09";
import {
  getOrCreateATA,
  getOrCreateATAs,
  MAX_U64,
  Token,
  TokenAmount,
  TOKEN_PROGRAM_ID,
  u64,
} from "@saberhq/token-utils";
import invariant from "tiny-invariant";
import { AnchorTypes } from "@saberhq/anchor-contrib";
import { GlobalId, QuarrySingleMine, SUBVOLT_LIST } from "./registry10";
import Decimal from "decimal.js";
import { mapValues } from "lodash-es";
import { useProviders } from "hooks/useProvider";

export const useQuarryAndRewarder = (quarry: string, rewarder: string) => {};

export const useFind = <T extends any[]>(
  addressFinder: (...finderArgs: T) => Promise<[PublicKey, number]>,
  finderArgs: T | undefined
): PublicKey | undefined | null => {
  const [stringResult, setStringResult] = useState<undefined | string>(
    undefined
  );

  useEffect(() => {
    (async () => {
      if (finderArgs !== undefined) {
        const stringResult = (await addressFinder(...finderArgs))[0];

        setStringResult(stringResult.toBase58());
      }
    })();
  });

  return usePubkey(stringResult);
};

export const useQuarrySDKMut = () => {
  const { providerMut } = useProviders();

  const quarrySDKMut = useMemo(() => {
    if (!providerMut) {
      return null;
    }
    return QuarrySDK.load({ provider: providerMut });
  }, [providerMut]);
  return quarrySDKMut;
};

/**
 * Only for use in SubvoltLoader10. If you need to access this somewhere else, then
 * the info should be exposed (via abstraction) in SubvoltLoader10.
 */
export const useAllQuarries = () => {
  const [quarryAddressMapping, quarryAddressList] = useMemo(() => {
    const arr: PublicKey[] = [];
    const result: Partial<
      Record<
        GlobalId,
        {
          index: number;
          quarry: PublicKey;
        }
      >
    > = {};
    let currentIndex = 0;
    // loop through each subvolt
    for (const def of SUBVOLT_LIST["mainnet-beta"]) {
      if (def.quarrySingleMine) {
        result[def.globalId] = {
          index: currentIndex,
          quarry: def.quarrySingleMine.quarryMine,
        };
        arr.push(def.quarrySingleMine.quarryMine);
        currentIndex += 1;
      }
    }
    return [result, arr];
  }, []);

  const parsedQuarries = useParsedAccountsData(quarryAddressList, PARSE_QUARRY);

  if (parsedQuarries.every((q) => q === undefined)) {
    return undefined;
  }
  return mapValues(quarryAddressMapping, (qa) => {
    if (qa) {
      return parsedQuarries[qa.index];
    }
  });
};

export const useSingleDeposit = (
  qsm: QuarrySingleMine
): ((amountHuman: Decimal) => Promise<TransactionEnvelope>) => {
  const sdkMut = useQuarrySDKMut();
  const stakedToken = useToken(qsm.stakedToken);

  return useCallback(
    async (amountHuman: Decimal) => {
      invariant(sdkMut, "sdk not connected");
      if (!stakedToken.data) {
        throw new Error(
          "Oops. Too fast, please try again.  Wow- Monster eats the stake"
        );
      }

      const authority = sdkMut.provider.wallet.publicKey;
      const rewarderW = await sdkMut.mine.loadRewarderWrapper(qsm.rewarder);
      const quarryW = await rewarderW.getQuarry(stakedToken.data);
      const minerW = await quarryW.getMinerActions(authority);

      const amount = TokenAmount.parse(
        stakedToken.data,
        amountHuman.toString()
      );
      const stakeTX = minerW.stake(amount);
      if (!(await sdkMut.provider.getAccountInfo(minerW.minerKey))) {
        const newMiner = await quarryW.createMiner();
        stakeTX.instructions.unshift(...newMiner.tx.instructions);
      }
      const ataTX = await minerW.createATAIfNotExists();
      if (ataTX) {
        return ataTX.combine(stakeTX);
      }
      return stakeTX;
    },
    [qsm.rewarder, sdkMut, stakedToken.data]
  );
};

export const useSingleWithdraw = (
  qsm: QuarrySingleMine
): ((amountHuman: Decimal) => Promise<TransactionEnvelope>) => {
  const sdkMut = useQuarrySDKMut();
  const stakedToken = useToken(qsm.stakedToken);

  return useCallback(
    async (amountHuman: Decimal) => {
      invariant(sdkMut, "sdk not connected");
      if (!stakedToken.data) {
        throw new Error("Oops. Too fast, please try again.");
      }

      const authority = sdkMut.provider.wallet.publicKey;
      const rewarderW = await sdkMut.mine.loadRewarderWrapper(qsm.rewarder);
      const quarryW = await rewarderW.getQuarry(stakedToken.data);
      const minerW = await quarryW.getMinerActions(authority);
      const amount = TokenAmount.parse(
        stakedToken.data,
        amountHuman.toString()
      );

      const withdrawTX = minerW.withdraw(amount);
      const ataTX = await minerW.createATAIfNotExists();
      return ataTX ? ataTX.combine(withdrawTX) : withdrawTX;
    },
    [qsm.rewarder, sdkMut, stakedToken.data]
  );
};

export const useSingleClaim = (qsm: QuarrySingleMine) => {
  const sdkMut = useQuarrySDKMut();
  const callback = useCallback(
    async (
      goodies: Goodies,
      quarry: NonNullable<ParsedAccountDatum<QuarryData>>,
      rewarder: NonNullable<ParsedAccountDatum<RewarderData>>
    ): Promise<TransactionEnvelope> => {
      invariant(
        sdkMut,
        "Should not be possible to press this button if sdkMut not available"
      );
      const authority = sdkMut.provider.wallet.publicKey;
      const rewarderW = await sdkMut.mine.loadRewarderWrapper(
        rewarder.accountId
      );
      const quarryW = await rewarderW.getQuarry(
        Token.fromMint(
          quarry.accountInfo.data.tokenMintKey,
          quarry.accountInfo.data.tokenMintDecimals
        )
      );

      // iou: qsm.iouToken, // DO NOT DO THIS ... because minerW.claim does this
      const realRewardATA = await getOrCreateATA({
        provider: sdkMut.provider,
        mint: qsm.realRewardToken.mintAccount,

        owner: sdkMut.provider.wallet.publicKey,
      });

      const minerW = await quarryW.getMinerActions(authority);
      let claimTX = await minerW.claim();

      if (qsm.redeemer === "special-marinade") {
        const redeemTx = await redeemMNDE({
          sdkMut,
          rewardTokenMint: rewarder.accountInfo.data.rewardsTokenMint,
          redeemerInfo: MARINADE_REDEEMER_INFO,
        });
        console.log(redeemTx);
        if (realRewardATA.instruction) {
          claimTX = claimTX.combine(
            new TransactionEnvelope(sdkMut.provider, [
              realRewardATA.instruction,
            ])
          );
        }
        console.log("Hey");
        claimTX = claimTX.combine(
          await redeemMNDE({
            sdkMut,
            rewardTokenMint: rewarder.accountInfo.data.rewardsTokenMint,
            redeemerInfo: MARINADE_REDEEMER_INFO,
          })
        );
      } else {
        throw new Error("literally everything has a redeemer bro");
      }

      return claimTX;
    },
    [qsm.realRewardToken.mintAccount, qsm.redeemer, sdkMut]
  );

  if (!sdkMut) {
    return null;
  }
  return callback;
};

const MARINADE_REDEEMER_INFO: RedeemerInfo = {
  method: "marinade",
  redeemerKey: "4seufhTiGG7Cq7rLLKeyYqoELkztecKnF3bx5ARfPW6M",
  redeemerVaultATA: "4zDEyfrJcGR3DQRzaThYSRxkeFM7zE4q12diwtbzQXPJ",
  underlyingToken: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
};

export const redeemQuarry = async ({
  sdkMut,
  rewardTokenMint,
  redeemerInfo,
}: {
  sdkMut: QuarrySDK;
  rewardTokenMint: PublicKey;
  redeemerInfo: RedeemerInfo;
}): Promise<TransactionEnvelope> => {
  const redeemer = await sdkMut.loadRedeemer({
    iouMint: rewardTokenMint,
    redemptionMint: new PublicKey(redeemerInfo.underlyingToken),
  });

  const authority = sdkMut.provider.wallet.publicKey;
  const { accounts, instructions } = await getOrCreateATAs({
    provider: sdkMut.provider,
    mints: {
      iou: redeemer.data.iouMint,
      redemption: redeemer.data.redemptionMint,
    },
    owner: authority,
  });

  // handle the TX
  return new TransactionEnvelope(sdkMut.provider, [
    ...instructions, // instructions for ATAs
    redeemer.program.instruction.redeemAllTokens({
      accounts: await redeemer.getRedeemTokenAccounts({
        iouSource: accounts.iou,
        redemptionDestination: accounts.redemption,
        sourceAuthority: authority,
      }),
    }),
  ]);
};

export const redeemMNDE = async ({
  sdkMut,
  rewardTokenMint,
  redeemerInfo,
}: {
  sdkMut: QuarrySDK;
  rewardTokenMint: PublicKey;
  redeemerInfo: RedeemerInfo;
}): Promise<TransactionEnvelope> => {
  const anchorProvider = new AnchorProvider(
    sdkMut.provider.connection,
    new SignerWallet(Keypair.generate()),
    {
      commitment: "recent",
    }
  );
  const tokadapt = new Program(
    TokadaptJSON,
    TOKADAPT_ID,
    anchorProvider
  ) as unknown as TATypes["Program"];
  const stateInfo = await tokadapt.account.state.fetch(TA_STATE);

  const outputMint = new PublicKey(redeemerInfo.underlyingToken);
  const [outputStorageAuthority] = await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode("storage"), TA_STATE.toBytes()],
    TOKADAPT_ID
  );

  const atas = await getOrCreateATAs({
    provider: sdkMut.provider,
    mints: {
      input: rewardTokenMint,
      output: outputMint,
    },
    owner: sdkMut.provider.wallet.publicKey,
  });

  const swapIX = tokadapt.instruction.swap(new u64(MAX_U64.toString()), {
    accounts: {
      state: TA_STATE,
      input: atas.accounts.input,
      inputAuthority: sdkMut.provider.wallet.publicKey,
      inputMint: rewardTokenMint,
      outputStorage: stateInfo.outputStorage,
      outputStorageAuthority,
      target: atas.accounts.output,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });

  // handle the TX
  return new TransactionEnvelope(sdkMut.provider, [
    // ...atas.instructions,
    // redeem instruction
    swapIX,
  ]);
};

type TATypes = AnchorTypes<
  TokadaptIDL,
  {
    state: TokenAdaptState;
  }
>;

type TokenAdaptState = TATypes["Accounts"]["State"];

/**
 * TOKADAPT
 * Marinade's redeemer
 */
export const TA_STATE = new PublicKey(
  "taspunvVUXLG82PrsCCtQeknWrGHNHWcZmVQYNcQBDg"
);

/**
 * Marinade's redeemer
 */
export const TOKADAPT_ID = new PublicKey(
  "tokdh9ZbWPxkFzqsKqeAwLDk6J6a8NBZtQanVuuENxa"
);

/**
 * Marinade's redeemer
 */
export type TokadaptIDL = {
  version: "0.0.0";
  name: "tokadapt";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "outputStorage";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "adminAuthority";
          type: "publicKey";
        },
        {
          name: "inputMint";
          type: "publicKey";
        }
      ];
    },
    {
      name: "swap";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "input";
          isMut: true;
          isSigner: false;
        },
        {
          name: "inputAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "inputMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "outputStorage";
          isMut: true;
          isSigner: false;
        },
        {
          name: "outputStorageAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "target";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "setAdmin";
      accounts: [
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "adminAuthority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "newAdminAuthority";
          type: "publicKey";
        }
      ];
    },
    {
      name: "close";
      accounts: [
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "adminAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "outputStorage";
          isMut: true;
          isSigner: false;
        },
        {
          name: "outputStorageAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenTarget";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rentCollector";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "State";
      type: {
        kind: "struct";
        fields: [
          {
            name: "adminAuthority";
            type: "publicKey";
          },
          {
            name: "inputMint";
            type: "publicKey";
          },
          {
            name: "outputStorage";
            type: "publicKey";
          },
          {
            name: "outputStorageAuthorityBump";
            type: "u8";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 300;
      name: "OutputStorageAuthorityDoesNotMatch";
      msg: "Treasury token authority does not match";
    },
    {
      code: 301;
      name: "OutputStorageMustNotBeCloseable";
      msg: "Treasury token account must not be closeable";
    },
    {
      code: 302;
      name: "OutputStorageMustNotBeDelegated";
      msg: "Treasury token account must not be delegated";
    },
    {
      code: 303;
      name: "InvalidInputMint";
      msg: "Invalid input mint";
    },
    {
      code: 304;
      name: "InvalidInputAuthority";
      msg: "Invalid input authority";
    },
    {
      code: 305;
      name: "InvalidCloseTokenTarget";
      msg: "Close token target must differ from storage";
    }
  ];
};

/**
 * Marinade's redeemer
 */
export const TokadaptJSON: TokadaptIDL = {
  version: "0.0.0",
  name: "tokadapt",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "outputStorage",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "adminAuthority",
          type: "publicKey",
        },
        {
          name: "inputMint",
          type: "publicKey",
        },
      ],
    },
    {
      name: "swap",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "input",
          isMut: true,
          isSigner: false,
        },
        {
          name: "inputAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "inputMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "outputStorage",
          isMut: true,
          isSigner: false,
        },
        {
          name: "outputStorageAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "target",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "setAdmin",
      accounts: [
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "adminAuthority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "newAdminAuthority",
          type: "publicKey",
        },
      ],
    },
    {
      name: "close",
      accounts: [
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "adminAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "outputStorage",
          isMut: true,
          isSigner: false,
        },
        {
          name: "outputStorageAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenTarget",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rentCollector",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "State",
      type: {
        kind: "struct",
        fields: [
          {
            name: "adminAuthority",
            type: "publicKey",
          },
          {
            name: "inputMint",
            type: "publicKey",
          },
          {
            name: "outputStorage",
            type: "publicKey",
          },
          {
            name: "outputStorageAuthorityBump",
            type: "u8",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 300,
      name: "OutputStorageAuthorityDoesNotMatch",
      msg: "Treasury token authority does not match",
    },
    {
      code: 301,
      name: "OutputStorageMustNotBeCloseable",
      msg: "Treasury token account must not be closeable",
    },
    {
      code: 302,
      name: "OutputStorageMustNotBeDelegated",
      msg: "Treasury token account must not be delegated",
    },
    {
      code: 303,
      name: "InvalidInputMint",
      msg: "Invalid input mint",
    },
    {
      code: 304,
      name: "InvalidInputAuthority",
      msg: "Invalid input authority",
    },
    {
      code: 305,
      name: "InvalidCloseTokenTarget",
      msg: "Close token target must differ from storage",
    },
  ],
};
