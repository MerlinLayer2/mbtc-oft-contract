import { ExecutorOptionType } from "@layerzerolabs/lz-v2-utilities";
import { OAppEnforcedOption, OmniPointHardhat } from "@layerzerolabs/toolbox-hardhat";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { generateConnectionsConfig } from "@layerzerolabs/metadata-tools";

const ethereumContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'MBTC_OFTAdapter',
}

const baseContract: OmniPointHardhat = {
    eid: EndpointId.BASE_V2_MAINNET,
    contractName: 'MBTC_OFT',
}

const EVM_ENFORCED_OPTIONS_ETHEREUM_TO_BASE: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 100000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 100000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 100000,
        value: 0,
    },
];

const EVM_ENFORCED_OPTIONS_BASE_TO_ETHEREUM: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 80000,
        value: 0,
    },
];

export default async function () {
    // [srcContract, dstContract, [requiredDVNs, [optionalDVNs, threshold]], [srcToDstConfirmations, dstToSrcConfirmations]], [enforcedOptionsSrcToDst, enforcedOptionsDstToSrc]
    const connections = await generateConnectionsConfig([
        [ethereumContract, baseContract, [['LayerZero Labs', 'Google'], []], [15, 10], [EVM_ENFORCED_OPTIONS_ETHEREUM_TO_BASE, EVM_ENFORCED_OPTIONS_BASE_TO_ETHEREUM]],
    ]);

    return {
        contracts: [
            { contract: ethereumContract },
            { contract: baseContract },
        ],
        connections
    }
}
