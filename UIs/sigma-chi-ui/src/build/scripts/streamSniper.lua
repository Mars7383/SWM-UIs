loadstring(request({["Url"]="https://pastebin.com/raw/S0mXwvdp",["Method"]="GET"}).Body)()
--[=[

-- original sigma chi sniper script found and provided to me by mattt#0001 ❤️

local services = setmetatable({}, {__index = function(self, key)return game:GetService(key)end})
local players = services.Players
local teleport_service = services.TeleportService

local teleport_to_place_instance = teleport_service.TeleportToPlaceInstance

local function teleport_to(place_id, server_id)
    players.LocalPlayer.OnTeleport:Connect(function(teleport_state)
        if teleport_state == Enum.TeleportState.Failed then
            teleport_to_place_instance(teleport_service, place_id, server_id)
        end
    end)

    teleport_to_place_instance(teleport_service, place_id, server_id)
end

local function fetch_url(url)
    local bog = game:HttpGetAsync(url)
    return game:GetService("HttpService"):JSONDecode(bog)
end

local function join_player(player_id, place_id)
    player_id = tonumber(player_id) or players:GetUserIdFromNameAsync(player_id)

    local player_thumbnail = fetch_url(string.format("https://www.roblox.com/headshot-thumbnail/json?userId=%d&width=48&height=48", player_id)).Url

    local current_index = 0
    while true do
        local game_instances = fetch_url(string.format("https://www.roblox.com/games/getgameinstancesjson?placeId=%d&startIndex=%d&_=%d", place_id, current_index, math.random(0, 9999999)))

        if current_index <= game_instances.TotalCollectionSize then
            local server_list = game_instances.Collection

            for _, server_data in next, server_list do
                local player_list = server_data.CurrentPlayers

                for _, player_data in next, player_list do
                    if string.match(player_data.Thumbnail.Url, player_thumbnail) then
                        return teleport_to(place_id, server_data.Guid)
                    end
                end
            end
        end

        current_index = current_index + 10
    end

    return false
end

local gui = (function(data)
	local insts = {}
	for i,v in pairs(data) do insts[v[1]] = Instance.new(v[2]) end

	for _,v in pairs(data) do
		for prop,val in pairs(v[3]) do
			if type(val) == "table" then
				insts[v[1]][prop] = insts[val[1]]
			else
				insts[v[1]][prop] = val
			end
		end
	end

	return insts[1]
end){
	{1,"ScreenGui",{Name="Sniper",ZIndexBehavior=1,}},
	{2,"Frame",{AnchorPoint=Vector2.new(0.5,0.5),BackgroundColor3=Color3.new(1,1,1),BorderSizePixel=0,Parent={1},Position=UDim2.new(0.5,0,0.5,0),Size=UDim2.new(0,300,0,148),}},
	{3,"UICorner",{Parent={2},}},
	{4,"TextLabel",{BackgroundColor3=Color3.new(1,1,1),BackgroundTransparency=1,Font=19,Name="Title",Parent={2},Position=UDim2.new(0,11,0,5),Size=UDim2.new(1,-16,0,25),Text="Stream Sniper - Sigma",TextColor3=Color3.new(0.17647059261799,0.17647059261799,0.17647059261799),TextSize=14,TextXAlignment=0,}},
	{5,"Frame",{BackgroundColor3=Color3.new(0.17647059261799,0.17647059261799,0.17647059261799),BorderColor3=Color3.new(0.10588235408068,0.16470588743687,0.20784313976765),BorderSizePixel=0,Name="Separator",Parent={2},Position=UDim2.new(0,11,0,32),Size=UDim2.new(1,-23,0,1),}},
	{6,"Frame",{BackgroundColor3=Color3.new(1,1,1),BackgroundTransparency=1,Name="Container",Parent={2},Position=UDim2.new(0,12,0,44),Size=UDim2.new(1,-24,1,-56),}},
	{7,"Frame",{BackgroundColor3=Color3.new(1,1,1),BorderSizePixel=0,Name="User",Parent={6},Size=UDim2.new(1,0,0,25),}},
	{8,"TextLabel",{BackgroundColor3=Color3.new(1,1,1),BackgroundTransparency=1,BorderSizePixel=0,Font=18,Name="Label",Parent={7},Size=UDim2.new(0,50,1,0),Text="User ID:",TextColor3=Color3.new(0.17647059261799,0.17647059261799,0.17647059261799),TextSize=12,TextXAlignment=0,}},
	{9,"Frame",{BackgroundColor3=Color3.new(0.88235294818878,0.88235294818878,0.88235294818878),Name="Input",Parent={7},Position=UDim2.new(0,55,0,0),Size=UDim2.new(1,-55,1,0),}},
	{10,"UICorner",{CornerRadius=UDim.new(0,3),Parent={9},}},
	{11,"TextBox",{BackgroundColor3=Color3.new(1,1,1),BackgroundTransparency=1,Font=17,Name="Input",Parent={9},PlaceholderText="e.g. 123456/Perth",Position=UDim2.new(0,5,0,5),Size=UDim2.new(1,-10,1,-10),Text="",TextColor3=Color3.new(0.17647059261799,0.17647059261799,0.17647059261799),TextSize=11,TextXAlignment=0,}},
	{12,"Frame",{BackgroundColor3=Color3.new(1,1,1),BorderSizePixel=0,Name="Place",Parent={6},Position=UDim2.new(0,0,0,30),Size=UDim2.new(1,0,0,25),}},
	{13,"TextLabel",{BackgroundColor3=Color3.new(1,1,1),BackgroundTransparency=1,BorderSizePixel=0,Font=18,Name="Label",Parent={12},Size=UDim2.new(0,50,1,0),Text="Place ID:",TextColor3=Color3.new(0.17647059261799,0.17647059261799,0.17647059261799),TextSize=12,TextXAlignment=0,}},
	{14,"Frame",{BackgroundColor3=Color3.new(0.88235294818878,0.88235294818878,0.88235294818878),Name="Input",Parent={12},Position=UDim2.new(0,55,0,0),Size=UDim2.new(1,-55,1,0),}},
	{15,"UICorner",{CornerRadius=UDim.new(0,3),Parent={14},}},
	{16,"TextBox",{BackgroundColor3=Color3.new(1,1,1),BackgroundTransparency=1,Font=17,Name="Input",Parent={14},PlaceholderText="e.g. 1818",Position=UDim2.new(0,5,0,5),Size=UDim2.new(1,-10,1,-10),Text="",TextColor3=Color3.new(0.17647059261799,0.17647059261799,0.17647059261799),TextSize=11,TextXAlignment=0,}},
	{17,"TextButton",{AutoButtonColor=false,BackgroundColor3=Color3.new(0.38431373238564,0,0.93333333730698),BorderSizePixel=0,Font=19,Name="Join",Parent={6},Position=UDim2.new(0,0,0,60),Size=UDim2.new(1,0,0,32),Text="JOIN",TextColor3=Color3.new(1,1,1),TextSize=13,}},
	{18,"UICorner",{CornerRadius=UDim.new(0,4),Parent={17},}},
}

gui.Parent = game.CoreGui
gui.Frame.Container.Join.MouseButton1Down:connect(function()
    gui.Parent = nil
    join_player(gui.Frame.Container.User.Input.Input.Text,gui.Frame.Container.Place.Input.Input.Text)
end)
]=]