export const IPMarketplaceABI = [
    {
        "type": "impl",
        "name": "MedialaneImpl",
        "interface_name": "medialane::core::interface::IMedialane"
    },
    {
        "type": "struct",
        "name": "core::integer::u256",
        "members": [
            {
                "name": "low",
                "type": "core::integer::u128"
            },
            {
                "name": "high",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "type": "enum",
        "name": "medialane::core::types::ItemType",
        "variants": [
            {
                "name": "Native",
                "type": "()"
            },
            {
                "name": "ERC20",
                "type": "()"
            },
            {
                "name": "ERC721",
                "type": "()"
            },
            {
                "name": "ERC1155",
                "type": "()"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::OfferItem",
        "members": [
            {
                "name": "item_type",
                "type": "medialane::core::types::ItemType"
            },
            {
                "name": "token",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "identifier_or_criteria",
                "type": "core::integer::u256"
            },
            {
                "name": "start_amount",
                "type": "core::integer::u256"
            },
            {
                "name": "end_amount",
                "type": "core::integer::u256"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::ConsiderationItem",
        "members": [
            {
                "name": "item_type",
                "type": "medialane::core::types::ItemType"
            },
            {
                "name": "token",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "identifier_or_criteria",
                "type": "core::integer::u256"
            },
            {
                "name": "start_amount",
                "type": "core::integer::u256"
            },
            {
                "name": "end_amount",
                "type": "core::integer::u256"
            },
            {
                "name": "recipient",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "type": "enum",
        "name": "medialane::core::types::OrderType",
        "variants": [
            {
                "name": "FULL_OPEN",
                "type": "()"
            },
            {
                "name": "PARTIAL_OPEN",
                "type": "()"
            },
            {
                "name": "FULL_RESTRICTED",
                "type": "()"
            },
            {
                "name": "PARTIAL_RESTRICTED",
                "type": "()"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::OrderParameters",
        "members": [
            {
                "name": "offerer",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "zone",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "offer",
                "type": "core::array::Span::<medialane::core::types::OfferItem>"
            },
            {
                "name": "consideration",
                "type": "core::array::Span::<medialane::core::types::ConsiderationItem>"
            },
            {
                "name": "order_type",
                "type": "medialane::core::types::OrderType"
            },
            {
                "name": "start_time",
                "type": "core::integer::u64"
            },
            {
                "name": "end_time",
                "type": "core::integer::u64"
            },
            {
                "name": "zone_hash",
                "type": "core::felt252"
            },
            {
                "name": "salt",
                "type": "core::felt252"
            },
            {
                "name": "conduit_key",
                "type": "core::felt252"
            },
            {
                "name": "total_original_consideration_items",
                "type": "core::integer::u32"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::Order",
        "members": [
            {
                "name": "parameters",
                "type": "medialane::core::types::OrderParameters"
            },
            {
                "name": "signature",
                "type": "core::array::Span::<core::felt252>"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::Fulfillment",
        "members": [
            {
                "name": "fulfiller",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "order_hash",
                "type": "core::felt252"
            },
            {
                "name": "nonce",
                "type": "core::felt252"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::FulfillmentRequest",
        "members": [
            {
                "name": "fulfillment",
                "type": "medialane::core::types::Fulfillment"
            },
            {
                "name": "signature",
                "type": "core::array::Span::<core::felt252>"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::Cancelation",
        "members": [
            {
                "name": "offerer",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "order_hash",
                "type": "core::felt252"
            },
            {
                "name": "nonce",
                "type": "core::felt252"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::CancelRequest",
        "members": [
            {
                "name": "cancelation",
                "type": "medialane::core::types::Cancelation"
            },
            {
                "name": "signature",
                "type": "core::array::Span::<core::felt252>"
            }
        ]
    },
    {
        "type": "enum",
        "name": "medialane::core::types::OrderStatus",
        "variants": [
            {
                "name": "None",
                "type": "()"
            },
            {
                "name": "Created",
                "type": "()"
            },
            {
                "name": "Filled",
                "type": "()"
            },
            {
                "name": "Cancelled",
                "type": "()"
            }
        ]
    },
    {
        "type": "struct",
        "name": "medialane::core::types::OrderDetails",
        "members": [
            {
                "name": "offerer",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "offer",
                "type": "core::array::Span::<medialane::core::types::OfferItem>"
            },
            {
                "name": "consideration",
                "type": "core::array::Span::<medialane::core::types::ConsiderationItem>"
            },
            {
                "name": "start_time",
                "type": "core::integer::u64"
            },
            {
                "name": "end_time",
                "type": "core::integer::u64"
            },
            {
                "name": "order_status",
                "type": "medialane::core::types::OrderStatus"
            },
            {
                "name": "fulfiller",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
            }
        ]
    },
    {
        "type": "interface",
        "name": "medialane::core::interface::IMedialane",
        "items": [
            {
                "type": "function",
                "name": "register_order",
                "inputs": [
                    {
                        "name": "order",
                        "type": "medialane::core::types::Order"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "fulfill_order",
                "inputs": [
                    {
                        "name": "fulfillment_request",
                        "type": "medialane::core::types::FulfillmentRequest"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "cancel_order",
                "inputs": [
                    {
                        "name": "cancel_request",
                        "type": "medialane::core::types::CancelRequest"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_order_details",
                "inputs": [
                    {
                        "name": "order_hash",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [
                    {
                        "type": "medialane::core::types::OrderDetails"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_order_hash",
                "inputs": [
                    {
                        "name": "parameters",
                        "type": "medialane::core::types::OrderParameters"
                    },
                    {
                        "name": "signer",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::felt252"
                    }
                ],
                "state_mutability": "view"
            }
        ]
    },
    {
        "type": "event",
        "name": "medialane::core::medialane::Medialane::OrderRegistered",
        "kind": "struct",
        "members": [
            {
                "name": "order_hash",
                "type": "core::felt252",
                "kind": "key"
            },
            {
                "name": "offerer",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "offer_token",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "data"
            },
            {
                "name": "offer_identifier",
                "type": "core::integer::u256",
                "kind": "data"
            },
            {
                "name": "consideration_token",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "data"
            },
            {
                "name": "consideration_amount",
                "type": "core::integer::u256",
                "kind": "data"
            },
            {
                "name": "start_time",
                "type": "core::integer::u64",
                "kind": "data"
            },
            {
                "name": "end_time",
                "type": "core::integer::u64",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "medialane::core::medialane::Medialane::OrderFulfilled",
        "kind": "struct",
        "members": [
            {
                "name": "order_hash",
                "type": "core::felt252",
                "kind": "key"
            },
            {
                "name": "offerer",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "fulfiller",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            }
        ]
    },
    {
        "type": "event",
        "name": "medialane::core::medialane::Medialane::OrderCancelled",
        "kind": "struct",
        "members": [
            {
                "name": "order_hash",
                "type": "core::felt252",
                "kind": "key"
            },
            {
                "name": "offerer",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            }
        ]
    },
    {
        "type": "event",
        "name": "medialane::core::medialane::Medialane::Event",
        "kind": "enum",
        "variants": [
            {
                "name": "OrderRegistered",
                "type": "medialane::core::medialane::Medialane::OrderRegistered",
                "kind": "nested"
            },
            {
                "name": "OrderFulfilled",
                "type": "medialane::core::medialane::Medialane::OrderFulfilled",
                "kind": "nested"
            },
            {
                "name": "OrderCancelled",
                "type": "medialane::core::medialane::Medialane::OrderCancelled",
                "kind": "nested"
            }
        ]
    }
];
