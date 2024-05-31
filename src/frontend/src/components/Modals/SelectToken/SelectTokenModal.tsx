import { Input, Spin } from "antd";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useTokenList } from "../../../hooks/useTokenList";
import { TokenDetails } from "../../../model/tokens";
import SearchIcon from "../../Icons/SearchIcon";
import { SelectTokenModalHeader } from "./components/SelectTokenHeader";

export interface SelectTokenModalProps {
	open: (value: boolean) => void;
	setToken: (token: TokenDetails) => void;
}

export default function SelectTokenModal(props: SelectTokenModalProps) {
	const { open, setToken } = props;
	const { tokens, loading } = useTokenList();

	const useOutsideAlerter = (ref: any) => {
		useEffect(() => {
			/**
			 * Alert if clicked on outside of element
			 */
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					open(false);
				}
			}
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, []);
	};

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef);

	return (
		<div>
			<div className={`modal-overlay`}>
				<div
					ref={wrapperRef}
					className={twMerge("flex flex-col items-center gap-3 modal-content-token")}
				>
					<SelectTokenModalHeader close={() => open(false)} />
					<Input
						prefix={<SearchIcon />}
						placeholder="Search"
						// onChange={debounce(handleInputChange)}
						className="input-pl bg-[#131216] p-3 text-sm font-normal border-none text-[rgba(255,255,255,0.5)]"
					/>
					<div className="flex flex-col items-center gap-3 self-stretch">
						<div className="flex justify-between items-center self-stretch text-sm font-medium text-[rgba(255,255,255,0.5)]">
							<span>Asset</span>
							<span>Balance</span>
						</div>
					</div>
					<div className="flex flex-col items-start gap-1 self-stretch">
						{(
							<>
								{loading ? <Spin /> : tokens.map((token: TokenDetails, index: number) => {
									return (
										<div
											key={index}
											className="flex items-center justify-between self-stretch border-b-[1px] bg-[#131216] p-3 border-b-[#323135] shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] cursor-pointer hover:border-[#27E3AB] hover:border-[1px]"
											onClick={() => {
												setToken(token);
												open(false)
											}}
										>
											<div className="flex items-center gap-2">
												<img
													src={token.logoURI}
													alt={token.name}
													className="h-7 w-7"
												/>
												<div className="flex flex-col items-start justify-center gap-[1px]">
													<span className="text-base font-medium">{token.symbol}</span>
													<span className="text-xs font-medium text-[rgba(255,255,255,0.5)]">{token.name}</span>
												</div>
											</div>
										</div>
									);
								})}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

