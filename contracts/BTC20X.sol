// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BTC20X is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    OwnableUpgradeable
{
    function initialize() public initializer {
        __Ownable_init();
        __ERC20_init("Bitcoin20X", "BTC20X");

        uint256 totalSupply = 21_000_000 * (10 ** decimals());

        _mint(_msgSender(), totalSupply);
    }
}
